const express = require("express");
const inventoryController = require("../controllers/inventory.controller");
const validateInventory = require("../validators/inventory.validator");

const router = express.Router();

// Defines inventory API endpoints
router.get("/", inventoryController.getAllInventory);
router.get("/:variantId", inventoryController.getInventoryByVariantId);
router.post("/", validateInventory, inventoryController.createInventory);
router.put("/:variantId", validateInventory, inventoryController.updateInventoryQuantity);
router.delete("/:variantId", inventoryController.deleteInventory);

module.exports = router;