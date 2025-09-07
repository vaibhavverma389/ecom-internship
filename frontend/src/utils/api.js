const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function authHeaders(){
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

export default {
  async signup(data){
    const res = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    return res.json();
  },
  async login(data){
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    return res.json();
  },
  async getItems(q = {}) {
    const params = new URLSearchParams(q).toString();
    const res = await fetch(`${BASE}/api/items?${params}`);
    return res.json();
  },
  async getCart(){
    const res = await fetch(`${BASE}/api/cart`, { headers: { ...authHeaders() }});
    return res.json();
  },
  async setCart(cartArray){
    const res = await fetch(`${BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeaders() },
      body: JSON.stringify(cartArray)
    });
    return res.json();
  },
  async mergeCart(cartArray){
    const res = await fetch(`${BASE}/api/cart/merge`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeaders() },
      body: JSON.stringify(cartArray)
    });
    return res.json();
  }
}
