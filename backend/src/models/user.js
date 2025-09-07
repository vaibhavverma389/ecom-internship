const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  qty: { type: Number, default: 1 }
}, { _id:false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cart: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
