import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const data = await api.login({ email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, name: data.user.name, email: data.user.email }));
      // merge local cart into server cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length) {
        await api.mergeCart(localCart);
        localStorage.removeItem('cart');
      }
      navigate('/');
    } else {
      alert(data.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
