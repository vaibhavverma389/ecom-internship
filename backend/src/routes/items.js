const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth'); // optional for admin CRUD

const router = express.Router();

// Create item (for simplicity, no admin check)
router.post('/', auth, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});

// Read items with filters: ?q=phone&category=electronics&min=10&max=200&sort=price_asc&page=1&limit=20
router.get('/', async (req, res) => {
  const { q, category, min, max, sort, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (min || max) filter.price = {};
  if (min) filter.price.$gte = Number(min);
  if (max) filter.price.$lte = Number(max);
  const sortObj = {};
  if (sort === 'price_asc') sortObj.price = 1;
  if (sort === 'price_desc') sortObj.price = -1;
  try {
    const items = await Item.find(filter)
      .sort(sortObj)
      .skip((page-1)*limit)
      .limit(Number(limit));
    const count = await Item.countDocuments(filter);
    res.json({ items, total: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update and Delete (admin-like protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
