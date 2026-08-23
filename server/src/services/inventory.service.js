const inventoryRepository = require("../repositories/inventory.repository");

// Get all inventory records
const getAllInventory = async () => {
    return await inventoryRepository.getAllInventory();
};

// Get inventory by variant ID
const getInventoryByVariantId = async (variantId) => {
    return await inventoryRepository.getInventoryByVariantId(variantId);
};

// Create inventory record
const createInventory = async (
    variantId,
    quantity,
    lowStockThreshold
) => {
    return await inventoryRepository.createInventory(
        variantId,
        quantity,
        lowStockThreshold
    );
};

// Update inventory quantity
const updateInventoryQuantity = async (
    variantId,
    quantity,
    lowStockThreshold
) => {
    return await inventoryRepository.updateInventoryQuantity(
        variantId,
        quantity,
        lowStockThreshold
    );
};

// Delete inventory record
const deleteInventory = async (variantId) => {
    return await inventoryRepository.deleteInventory(variantId);
};

module.exports = {
    getAllInventory,
    getInventoryByVariantId,
    createInventory,
    updateInventoryQuantity,
    deleteInventory,
};