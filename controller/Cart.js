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
  const { id } = req.user;
  const options = { new: true };
  
  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { 'product': productId, 'userId': id },
      { $set: { 'quantity': quantity } },
      options
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

exports.removeProductsFromCart = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user.id; // Assuming user ID is stored in req.user.id
  try {
    const product = await Cart.findOneAndDelete({ _id: paramsId, 'userId': userId }); // Add user ID condition
    res.status(200).json("product is deleted");
  } catch (error) {
    res.status(401).json(error);
  }
};
