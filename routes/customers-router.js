const express = require("express");
const {
  getCustomers,
  addCustomer,
  editCustomer,
  deleteCustomer,
} = require("../controllers/customers-controller");
const router = express.Router();

router.get("/", getCustomers);
router.post("/", addCustomer);
router.patch("/", editCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
