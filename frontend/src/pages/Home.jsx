import { useEffect, useState } from 'react'
import api from '../utils/api'

function saveLocalCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export default function Home() {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ q: '', category: '', min: '', max: '', sort: '' })
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const res = await api.getItems(filters)
    setItems(res.items || [])
  }

  async function addToCart(item) {
    const existing = cart.find((c) => c.itemId === item._id)
    let newCart
    if (existing) {
      newCart = cart.map((c) => (c.itemId === item._id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      newCart = [...cart, { itemId: item._id, qty: 1, title: item.title, price: item.price }]
    }
    setCart(newCart)
    saveLocalCart(newCart)

    const token = localStorage.getItem('token')
    if (token) {
      await api.setCart(newCart.map((c) => ({ itemId: c.itemId, qty: c.qty })))
    }
    alert('Added to cart')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
      {/* Sidebar Filters */}
      <aside className="md:col-span-1 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
        <h3 className="font-bold text-xl text-indigo-700 mb-4 border-b pb-2">✨ Filters</h3>

        <input
          placeholder="🔍 Search products..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />

        <input
          placeholder="📂 Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <div className="flex gap-3 mb-3">
          <input
            placeholder="Min ₹"
            value={filters.min}
            onChange={(e) => setFilters({ ...filters, min: e.target.value })}
            className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <input
            placeholder="Max ₹"
            value={filters.max}
            onChange={(e) => setFilters({ ...filters, max: e.target.value })}
            className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Sort By</option>
          <option value="price_asc">⬆ Price: Low → High</option>
          <option value="price_desc">⬇ Price: High → Low</option>
        </select>

        <button
          onClick={fetchItems}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 transition-colors text-white p-2 rounded-lg shadow-md"
        >
          Apply Filters
        </button>
      </aside>

      {/* Products Section */}
      <section className="md:col-span-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-600 text-lg font-medium">
            🚫 No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 flex flex-col border border-white/60"
              >
                <img
                  src={item.image || 'https://via.placeholder.com/300'}
                  alt={item.title}
                  className="h-48 w-full object-cover rounded-xl mb-4 shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gradient-to-r from-green-200 to-green-400 text-green-900 rounded-full">
                    {item.category || 'General'}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold text-xl text-indigo-700">₹{item.price}</div>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-colors text-white rounded-lg shadow-md"
                  >
                    🛒 Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
