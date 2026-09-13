const express = require("express");
const orderController = require("../controllers/order.controller");
const validateOrder = require("../validators/order.validator");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", validateOrder, orderController.createOrder); // Public for checkout
router.get("/", requireAuth, orderController.getOrders);
router.get("/:id", requireAuth, orderController.getOrderById);
router.put("/:id/status", requireAuth, orderController.updateOrderStatus);

module.exports = router;
