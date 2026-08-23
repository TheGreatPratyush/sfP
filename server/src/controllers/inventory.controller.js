const inventoryService = require("../services/inventory.service");
const {
    emitInventoryUpdate,
} = require("../sockets/inventory.socket");

// Handles inventory API operations
const getAllInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getAllInventory();

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

const getInventoryByVariantId = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getInventoryByVariantId(
            req.params.variantId
        );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found",
            });
        }

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

const createInventory = async (req, res, next) => {
    try {
        const {
            variantId,
            quantity,
            lowStockThreshold,
        } = req.body;

        const inventory = await inventoryService.createInventory(
            variantId,
            quantity,
            lowStockThreshold
        );

        const io = req.app.get("io");

        if (io) {
            emitInventoryUpdate(io, "created", inventory);
        }

        res.status(201).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

const updateInventoryQuantity = async (req, res, next) => {
    try {
        const inventory = await inventoryService.updateInventoryQuantity(
            req.params.variantId,
            req.body.quantity
        );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found",
            });
        }

        const io = req.app.get("io");

        if (io) {
            emitInventoryUpdate(io, "updated", inventory);
        }

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

const deleteInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.deleteInventory(
            req.params.variantId
        );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found",
            });
        }

        const io = req.app.get("io");

        if (io) {
            emitInventoryUpdate(io, "deleted", inventory);
        }

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInventory,
    getInventoryByVariantId,
    createInventory,
    updateInventoryQuantity,
    deleteInventory,
};