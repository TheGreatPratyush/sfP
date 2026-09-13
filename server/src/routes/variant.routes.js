const express = require("express");
const variantController = require("../controllers/variant.controller");
const validateVariant = require("../validators/variant.validator");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Defines product variant API endpoints
router.get("/", variantController.getAllVariants);
router.get("/product/:productId", variantController.getVariantsByProductId);
router.get("/:id", variantController.getVariantById);
router.post("/", requireAuth, validateVariant, variantController.createVariant);
router.put("/:id", requireAuth, validateVariant, variantController.updateVariant);
router.delete("/:id", requireAuth, variantController.deleteVariant);

module.exports = router;