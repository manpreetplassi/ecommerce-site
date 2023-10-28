const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema({
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

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  password: { type: String, required: [true, "Password is required"] },
  email: { type: String, required: [true, "Email is required"] },
  role: { type: String, default: "user" },
  addresses: [{ type: [addressSchema] }],
});

const virtuals = userSchema.virtual('id');
virtuals.get(function(){
  return this._id;
})
userSchema.set('toJSON',{
  virtuals: true,
  versionKey: false,
  transform: function(doc,ret){delete ret._id}
})
const User = mongoose.model("User", userSchema);

module.exports = User;
