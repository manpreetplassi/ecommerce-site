const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  description: { type: String, required: [true, "Description is required"] },
  price: { type: Number, required: [true, "Price is required"], min: [1, "Price must be at least 1"], max: [10000, "Price cannot exceed 10000"] },
  discountPercentage: { type: Number, required: [true, "Discount percentage is required"], min: [1, "Discount percentage must be at least 1"], max: [100, "Discount percentage cannot exceed 100"] },
  rating: { type: Number, default: 0, min: [0, "Rating cannot be less than 0"], max: [5, "Rating cannot exceed 5"] },
  stock: { type: Number, required: [true, "Stock is required"], min: [0, "Stock cannot be negative"] },
  brand: { type: String, required: [true, "Brand is required"] },
  category: { type: String, required: [true, "Category is required"] },
  thumbnail: { type: String, required: [true, "Thumbnail URL is required"] },
  images: [{ type: Array, required: [true, "Image URLs are required"] }],
  deleted: { type: Boolean, default: false },
});

const virtuals = productSchema.virtual('id');
virtuals.get(function(){
  return this._id;
})
productSchema.set('toJSON',{
  virtuals: true,
  versionKey: false,
  transform: function(doc,ret){delete ret._id}
})
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
