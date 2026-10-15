import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const Ctx = createContext(); export const useApp = () => useContext(Ctx);
export function AppProvider({ children }) {
  const [user, setUser] = useState(null); const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  useEffect(() => { localStorage.getItem('token') && api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')); }, []);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  const login = d => { localStorage.setItem('token', d.token); setUser(d.user); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const addToCart = item => setCart(c => [...c, item]);
  const removeFromCart = i => setCart(c => c.filter((_, x) => x !== i));
  return <Ctx.Provider value={{ user, login, logout, cart, setCart, addToCart, removeFromCart }}>{children}</Ctx.Provider>;
}