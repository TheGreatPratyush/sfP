const express = require("express");
const customerController = require("../controllers/customer.controller");
const validateCustomer = require("../validators/customer.validator");

const router = express.Router();

router.post("/", validateCustomer, customerController.createCustomer);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", validateCustomer, customerController.updateCustomer);
router.get("/:id/orders", customerController.getCustomerOrders);

module.exports = router;
