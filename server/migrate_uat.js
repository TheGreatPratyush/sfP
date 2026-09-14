const { Client } = require('pg');

const sourceDb = new Client({ user: 'pratyushgupta', host: 'localhost', database: 'clothing_store', port: 5432 });
const destDb = new Client({ user: 'pratyushgupta', host: 'localhost', database: 'clothing_store_uat', port: 5432 });

async function insertRow(table, row) {
    const columns = Object.keys(row);
    const values = Object.values(row);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
    await destDb.query(query, values);
}

async function migrate() {
    await sourceDb.connect();
    await destDb.connect();

    console.log("Starting UAT migration (Variant-aware)...");

    try {
        const resProducts = await sourceDb.query(`
            SELECT * FROM products
            WHERE id IN (SELECT product_id FROM product_variants)
            UNION
            SELECT * FROM products
            ORDER BY id DESC
            LIMIT 40
        `);
        const products = resProducts.rows;
        const categoryIds = [...new Set(products.map(p => p.category_id))].filter(id => id !== null);

        console.log(`Migrating ${categoryIds.length} categories...`);
        for (let cid of categoryIds) {
            const resCat = await sourceDb.query('SELECT * FROM categories WHERE id = $1', [cid]);
            if (resCat.rows[0]) await insertRow('categories', resCat.rows[0]);
        }

        console.log(`Migrating ${products.length} products...`);
        for (let p of products) {
            await insertRow('products', p);

            const resImages = await sourceDb.query('SELECT * FROM product_images WHERE product_id = $1', [p.id]);
            for (let img of resImages.rows) {
                await insertRow('product_images', img);
            }

            const resVariants = await sourceDb.query('SELECT * FROM product_variants WHERE product_id = $1', [p.id]);
            for (let v of resVariants.rows) {
                await insertRow('product_variants', v);

                const resInv = await sourceDb.query('SELECT * FROM inventory WHERE variant_id = $1', [v.id]);
                for (let inv of resInv.rows) {
                    await insertRow('inventory', inv);
                }
            }
        }
        console.log("Migration complete.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await sourceDb.end();
        await destDb.end();
    }
}

migrate();
