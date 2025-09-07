const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
