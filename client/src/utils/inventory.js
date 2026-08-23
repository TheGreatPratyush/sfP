export const getStockStatus = (
    quantity,
    threshold = 0
) => {
    const stock = Number(quantity) || 0;
    const limit = Number(threshold) || 0;

    if (stock <= 0) {
        return "out-of-stock";
    }

    if (stock <= limit) {
        return "low-stock";
    }

    return "in-stock";
};

export const getStockStatusLabel = (status) => {
    const labels = {
        "in-stock": "In Stock",
        "low-stock": "Low Stock",
        "out-of-stock": "Out of Stock",
    };

    return labels[status] || "Unknown";
};

export const isLowStock = (
    quantity,
    threshold = 0
) => {
    return (
        Number(quantity) > 0 &&
        Number(quantity) <= Number(threshold)
    );
};

export const isOutOfStock = (quantity) => {
    return Number(quantity) <= 0;
};

export const getInventorySummary = (
    inventory = []
) => {
    return inventory.reduce(
        (summary, item) => {
            const status = getStockStatus(
                item.quantity,
                item.low_stock_threshold
            );

            summary.total += 1;

            if (status === "in-stock") {
                summary.inStock += 1;
            } else if (status === "low-stock") {
                summary.lowStock += 1;
            } else {
                summary.outOfStock += 1;
            }

            summary.totalStock +=
                Number(item.quantity) || 0;

            return summary;
        },
        {
            total: 0,
            inStock: 0,
            lowStock: 0,
            outOfStock: 0,
            totalStock: 0,
        }
    );
};