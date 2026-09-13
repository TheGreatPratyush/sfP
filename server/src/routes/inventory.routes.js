const express = require("express");
const inventoryController = require("../controllers/inventory.controller");
const validateInventory = require("../validators/inventory.validator");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Defines inventory API endpoints
router.get("/", inventoryController.getAllInventory);
router.get("/:variantId", inventoryController.getInventoryByVariantId);
router.post("/", requireAuth, validateInventory, inventoryController.createInventory);
router.put("/:variantId", requireAuth, validateInventory, inventoryController.updateInventoryQuantity);
router.delete("/:variantId", requireAuth, inventoryController.deleteInventory);

module.exports = router;