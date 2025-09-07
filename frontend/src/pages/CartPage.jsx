import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Your Cart</h2>
      {cart.length === 0 ? <p>No items in cart</p> : (
        <ul>
          {cart.map((item, i) => (
            <li key={i} className="flex justify-between border p-2 mb-2">
              <span>{item.name} - ${item.price}</span>
              <button 
                onClick={() => removeItem(i)} 
                className="bg-red-500 text-white px-2 py-1"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
