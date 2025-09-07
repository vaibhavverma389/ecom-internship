import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Signup(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await api.signup({ name, email, password });
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify({ id: res.user.id, name: res.user.name }));
      // merge local cart
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length) {
        await api.mergeCart(localCart);
        localStorage.removeItem('cart');
      }
      navigate('/');
    } else {
      alert(res.message || 'Signup error');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create an account</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full mb-2 p-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Sign up</button>
      </form>
    </div>
  );
}
