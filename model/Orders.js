const mongoose = require("mongoose");

// Define the schema for the "selectedAdd" field
const selectedAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  countryName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  phone: { type: String, required: true },
  phone2: { type: String, default: "" },
});


const productSchema = new mongoose.Schema({
  product:{ type: mongoose.Schema.Types.ObjectId, ref:'Product', required: [true, "Product is required"]},
  quantity: { type: Number, required:true }
})

const orderSchema = new mongoose.Schema({
  products: [productSchema],
  userId:{ type: String, required: [true, "userId is required"]},
  // userId:{ type: mongoose.Schema.Types.ObjectId, required: [true, "userId is required"]},
  selectedAdd: { type: selectedAddressSchema, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  status: { type: String, required: true },
});

const virtuals = orderSchema.virtual('id');
virtuals.get(function(){
  return this._id;
})
orderSchema.set('toJSON',{
  virtuals: true,
  versionKey: false,
  transform: function(doc,ret){delete ret._id}
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;