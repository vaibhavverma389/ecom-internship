import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/home'
import CartPage from './pages/CartPage'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Home/>} />
          <Route path="signup" element={<Signup/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="cart" element={<CartPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
