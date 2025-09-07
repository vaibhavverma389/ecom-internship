import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './utils/api';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // optional: fetch profile
    }
  }, []);

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold"><Link to="/">MyShop</Link></div>
        <div className="space-x-4">
          <Link to="/">Shop</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={logout} className="ml-2 px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 border rounded">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
