const express = require("express");
const { addProductToCart, fetchCartProductsByUser, removeProductsFromCart, updateCartProductQty } = require("../controller/Cart");
const { authUser } = require("../controller/Middlewere");
const router = express.Router();

router.post("/", addProductToCart)
.get("/", fetchCartProductsByUser)
.delete("/:id", removeProductsFromCart)
.patch("/", updateCartProductQty)

exports.router = router;