const Order = require("../model/Orders");

exports.createOrders = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const items = await newOrder.save();
    res.status(200).json(items);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.fetchAllOrders = async (req, res) => {
  const queryString = req.query;
  let query = Order.find({});
  let totalQueryOrders = Order.find({});
  if (queryString._page && queryString._limit) {
    const pageSize = parseInt(queryString._limit); 
    const page = parseInt(queryString._page); 
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  if (queryString._sort && queryString._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  try {
    const totalOrders = await totalQueryOrders.count().exec();
    res.set("X-Total-Count", totalOrders);
    const orders = await query.populate('products.product').exec(); 
    res.status(200).json(orders);
  } catch (error) {
    console.error("fetchAllOrders Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchOrdersByUserId = async (req, res) => {
  const {userId} = req.query;
  try {
    const userOrders = await Order.find({"userId": userId}).populate('products.product');
    await res.status(200).json(userOrders);
  } catch (error) {
    console.log("fetchOrdersByUserId Error: ", error)
    res.status(401).json(error);
  }
};

exports.updateOrderById = async (req, res) => {
  const {id} = req.params;
  try {
    const userOrders = await Order.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(userOrders);
  } catch (error) {
    console.log("upadteOrderById Error: " ,error)
    res.status(401).json(error);
  }
};

exports.removeOrdersById = async (req, res) => {
  const {id} = req.params;
  try {
    const userOrders = await Order.findByIdAndDelete(id);
    res.status(200).json("Your order has been removed");
  } catch (error) {
    console.log("removeOrdersById Error: " ,error)
    res.status(401).json(error);
  }
};
