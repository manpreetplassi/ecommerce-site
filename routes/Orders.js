const express = require("express");
const { createOrders, fetchOrdersByUserId, removeOrdersById, fetchAllOrders, updateOrderById } = require("../controller/Orders");
const router = express.Router();

router.post("/", createOrders)
.get("/", fetchOrdersByUserId)
.get("/admin", fetchAllOrders)
.patch("/:id", updateOrderById)
.delete("/:id", removeOrdersById)

exports.router = router;