const express = require("express");
const orderController = require("../controllers/order.controller");
const validateOrder = require("../validators/order.validator");

const router = express.Router();

router.post("/", validateOrder, orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
