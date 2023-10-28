const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(200).json(doc);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({});
  let totalQueryProducts = Product.find({});
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalQueryProducts = totalQueryProducts.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalQueryProducts = totalQueryProducts.find({ brand: req.query.brand });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalQueryProducts = totalQueryProducts.sort({
      [req.query._sort]: req.query._order,
    });
  }
  try {
    const totalDocs = await totalQueryProducts.count().exec();
    res.set("X-Total-Count", totalDocs);
    const docs = await query.exec();
    res.status(200).json(docs);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.updateProductById = async (req, res) => {
  const {id} = req.params; 
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(product);
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.fetchProductById = async (req, res) => {
  const {id} = req.params; 
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(401).json(error);
  }
};


exports.loginUser = async (req, res) => {
  try {
    const userMain = await User.findOne({ email: req.body.email }, "id name email role password");
    const user = await [userMain.id ,userMain.name ,userMain.email ,userMain.role ]
      // res.status(200).json(user.password);
    if (userMain.password === req.body.password) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials"}); // Fixed typo here
    }
  } catch (error) {
    res.status(500).json(error); // You might want to use a more appropriate status code for server errors
  }
};
