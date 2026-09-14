const http = require('http');

async function request(path, method, body = null, token = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => data+=chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} }));
        });
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log("Starting UAT Smoke Tests...");
    
    // 1. Fetch Products
    const resProducts = await request('/api/products', 'GET');
    console.log("Fetch products:", resProducts.status === 200 && resProducts.data.data.length > 0 ? "PASS" : "FAIL");

    let variantId = null;
    let productId = null;
    for (let p of resProducts.data.data) {
        const resVariants = await request(`/api/products/${p.id}`, 'GET');
        if (resVariants.data.data.variants && resVariants.data.data.variants.length > 0) {
            productId = p.id;
            variantId = resVariants.data.data.variants[0].id;
            break;
        }
    }

    if (!variantId) {
        console.log("Failed to find a product with variants.");
        return;
    }

    // 2. Register Customer
    const resReg = await request('/api/customer-auth/register', 'POST', {
        name: "UAT Tester", email: "uat@example.com", phone: "1231231234", password: "securepassword"
    });
    console.log("Customer registration:", (resReg.status === 200 || resReg.status === 409) ? "PASS" : "FAIL (" + resReg.status + ")");

    // 3. Login Customer
    const resLogin = await request('/api/customer-auth/login', 'POST', {
        email: "uat@example.com", password: "securepassword"
    });
    console.log("Customer login:", resLogin.status === 200 ? "PASS" : "FAIL");
    const customerToken = resLogin.data?.token;

    // 4. Place Order
    const resOrder = await request('/api/orders', 'POST', {
        customer: { name: "UAT Tester", email: "uat@example.com", phone: "123", address: "123", city: "A", state: "A", pincode: "123" },
        items: [{ variant_id: variantId, quantity: 1 }]
    }, customerToken);
    console.log("Place order:", resOrder.status === 201 ? "PASS" : "FAIL (" + resOrder.status + ")");

    // 5. Owner Login
    const resOwnerLogin = await request('/api/auth/login', 'POST', {
        password: "admin123"
    });
    console.log("Owner login:", resOwnerLogin.status === 200 ? "PASS" : "FAIL");
    const ownerToken = resOwnerLogin.data?.token;

    // 6. Cross-Auth Test (Owner token on Customer endpoint should fail or vice versa)
    const resFailAuth = await request('/api/dashboard/stats', 'GET', null, customerToken);
    console.log("Customer JWT rejected by Owner API:", resFailAuth.status === 401 || resFailAuth.status === 403 ? "PASS" : "FAIL");

    // 7. Verify inventory decreased
    const resInv = await request(`/api/inventory/${variantId}`, 'GET', null, ownerToken);
    console.log("Fetch inventory:", resInv.status === 200 ? "PASS" : "FAIL");
}

runTests();
