require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');

const items = [
  { title: 'Wireless Headphones', description: 'Noise-cancelling', price: 59.99, category: 'electronics', image: '' },
  { title: 'Running Shoes', description: 'Lightweight', price: 79.99, category: 'sports', image: '' },
  { title: 'Coffee Mug', description: 'Ceramic 350ml', price: 9.99, category: 'home', image: '' }
  // add many more to demo filters/pagination
];

mongoose.connect(process.env.MONGO_URI).then(async ()=> {
  await Item.deleteMany({});
  await Item.insertMany(items);
  console.log('Seeded items');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
