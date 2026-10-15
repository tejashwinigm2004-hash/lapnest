import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext'; import Navbar from './components/Navbar'; import Footer from './components/Footer'; import FloatingSocial from './components/FloatingSocial';
import Home from './pages/Home'; import Products from './pages/Products'; import ProductDetails from './pages/ProductDetails'; import Cart from './pages/Cart'; import Auth from './pages/Login'; import UserDashboard from './pages/UserDashboard'; import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About'; import Contact from './pages/Contact'; import NotFound from './pages/NotFound'; import Policy from './pages/Policy'; import ScrollProgress from './components/ScrollProgress'; import PageFade from './components/PageFade';
const Soon = ({ t }) => <p className="p-10 text-center">{t} is on the next-step list.</p>;
const Guard = ({ roles, children }) => { const { user } = useApp(); return user && roles.includes(user.role) ? children : <Navigate to="/login" />; };
export default function App() {
  return <AppProvider><BrowserRouter><Toaster /><ScrollProgress /><Navbar /><main className="min-h-[60vh]"><PageFade><Routes>
    <Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<Cart />} /><Route path="/login" element={<Auth />} /><Route path="/register" element={<Auth register />} />
    <Route path="/user" element={<Guard roles={['user']}><UserDashboard /></Guard>} /><Route path="/admin" element={<Guard roles={['admin', 'staff']}><AdminDashboard /></Guard>} />
    <Route path="/terms" element={<Policy kind="terms" />} /><Route path="/privacy" element={<Policy kind="privacy" />} /><Route path="/refund-policy" element={<Policy kind="refund" />} />
    <Route path="*" element={<NotFound />} /></Routes></PageFade></main><Footer /><FloatingSocial /></BrowserRouter></AppProvider>;
}