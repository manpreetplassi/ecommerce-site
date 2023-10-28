const Cart = require("../model/Cart");

exports.addProductToCart = async (req, res) => {
  const newCartProduct = new Cart(req.body);
  try {
    const items = await newCartProduct.save();
    res.status(200).json(items);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.fetchCartProductsByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartProducts = await Cart.find({ userId: id }).populate("product");
    res.status(200).json(cartProducts);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.updateCartProductQty = async (req, res) => {
  const { productId, quantity } = req.body;
  const options = { new: true };

  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { 'product': productId },
      { $set: { 'quantity': quantity } },
      options
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.removeProductsFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Cart.findByIdAndDelete(id);
    res.status(200).json("product is deleted");
  } catch (error) {
    res.status(401).json(error);
  }
};
