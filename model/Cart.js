const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product:{ type: mongoose.Schema.Types.ObjectId, ref:'Product', required: [true, "Product is required"]},
  quantity: { type: Number, required: [true, "quantity is required"], min: [0, "quantity cannot be negative"] },
  userId:{ type: String, required: [true, "userId is required"]},
});

const virtuals = cartSchema.virtual('id');
virtuals.get(function(){
  return this._id;
})
cartSchema.set('toJSON',{
  virtuals: true,
  versionKey: false,
  transform: function(doc,ret){delete ret._id}
})

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
