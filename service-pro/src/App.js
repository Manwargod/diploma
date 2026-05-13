import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import Home from './pages/Home';
import Repair from './pages/Repair';
import Build from './pages/Build';
import Market from './pages/Market';
import ProductDetail from './pages/ProductDetail';
import Warranty from './pages/Warranty';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import ProviderDashboard from './pages/ProviderDashboard';
import ChatWidget from './components/ChatWidget';
import NotFound from './pages/NotFound';
import OrderDetail from './pages/OrderDetail';

function App() {
  const { i18n } = useTranslation();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sp_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('sp_theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout isDark={isDark} setIsDark={setIsDark} i18n={i18n}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/repair" element={<Repair isDark={isDark} />} />
              <Route path="/build" element={<Build isDark={isDark} />} />
              <Route path="/market" element={<Market isDark={isDark} />} />
              <Route path="/product/:productId" element={<ProductDetail isDark={isDark} />} />
              <Route path="/warranty" element={<Warranty isDark={isDark} />} />
              <Route path="/dashboard" element={<Dashboard isDark={isDark} />} />
              <Route path="/provider" element={<ProviderDashboard isDark={isDark} />} />
              <Route path="/checkout" element={<Checkout isDark={isDark} />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/orders/:orderId" element={<OrderDetail isDark={isDark} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <ChatWidget />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;