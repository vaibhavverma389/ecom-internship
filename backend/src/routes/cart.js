const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const Item = require('../models/Item');
const mongoose = require('mongoose');

const router = express.Router();

// get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    await req.user.populate('cart.itemId');
    res.json(req.user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// replace cart or set quantities
router.post('/', auth, async (req, res) => {
  // expects: [{ itemId, qty }, ...]
  try {
    const newCart = (req.body || []).map(i => ({ itemId: mongoose.Types.ObjectId(i.itemId), qty: Number(i.qty) }));
    req.user.cart = newCart;
    await req.user.save();
    await req.user.populate('cart.itemId');
    res.json(req.user.cart);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});

// merge cart (client uses this on login to merge local cart into DB)
router.post('/merge', auth, async (req,res) => {
  try {
    const incoming = req.body || []; // [{itemId, qty}]
    const map = new Map();
    // existing
    req.user.cart.forEach(ci => map.set(String(ci.itemId), ci.qty));
    incoming.forEach(ci => {
      const id = String(ci.itemId);
      map.set(id, (map.get(id) || 0) + Number(ci.qty));
    });
    req.user.cart = Array.from(map.entries()).map(([itemId, qty]) => ({ itemId, qty }));
    await req.user.save();
    await req.user.populate('cart.itemId');
    res.json(req.user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
