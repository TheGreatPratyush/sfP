const express = require("express");
const customerOrderController = require("../controllers/customerOrder.controller");
const requireCustomerAuth = require("../middleware/customerAuth.middleware");

const router = express.Router();

router.use(requireCustomerAuth); // Protected by customer JWT strictly

router.get("/", customerOrderController.getMyOrders);
router.get("/:id", customerOrderController.getMyOrderDetails);

module.exports = router;
