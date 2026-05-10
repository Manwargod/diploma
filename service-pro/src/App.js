import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// --- Translations ---
const translations = {
  ru: {
    home: "Главная", repair: "Ремонт", build: "Сборка", market: "Марnodeкет", cabinet: "Кабинет",
    heroTitle: "ТЕХНОЛОГИЧНЫЙ СЕРВИС", heroSub: "Профессиональный ремонт и кастомные сборки в Казахстане.",
    startBtn: "Начать ремонт", buildBtn: "Собрать ПК",
    aiConsultant: "AI Консультант", aiWelcome: "Салем! Чем могу помочь?",
    warrantyTitle: "Проверка гарантии", warrantyPlaceholder: "Введите серийный номер (S/N)",
    warrantyCheck: "Проверить", footerReks: "ТОО «ServiceTap Digital», г. Алматы, пр. Аль-Фараби 77/7",
    lang: "RU",
    // Additional translations
    repairServices: "Услуги ремонта",
    builtConfigs: "Готовые конфигурации",
    budgetConfig: "Бюджетная",
    optimalConfig: "Оптимальная",
    ultimateConfig: "Ультимативная",
    serviceMarket: "Service Market",
    selectCategory: "Выберите категорию",
    liveSearch: "Живой поиск техники...",
    noProducts: "Товары не найдены",
    price: "Цена",
    addToCart: "Добавить в корзину",
    returnToMarket: "Вернуться в маркет",
    backButton: "Вернуться в маркет",
    rating: "рейтинг",
    features: "Основные возможности",
    recommended: "Рекомендованные товары",
    guaranteeCheck: "Проверка гарантии",
    personalCabinet: "Личный кабинет",
    // Categories
    allCategory: "Все",
    smartphonesCategory: "Смартфоны",
    laptopsCategory: "Ноутбуки",
    componentsCategory: "Железо",
  },
  kz: {
    home: "Басты бет", repair: "Жөндеу", build: "Құрастыру", market: "Маркет", cabinet: "Кабинет",
    heroTitle: "ТЕХНОЛОГИЯЛЫҚ СЕРВИС", heroSub: "Қазақстандағы кәсіби жөндеу және кастомды құрастыру.",
    startBtn: "Жөндеуді бастау", buildBtn: "ПК жинау",
    aiConsultant: "AI Кеңесші", aiWelcome: "Сәлем! Қалай көмектесе аламын?",
    warrantyTitle: "Кепілдікті тексеру", warrantyPlaceholder: "Сериялық нөмірді енгізіңіз (S/N)",
    warrantyCheck: "Тексеру", footerReks: "«ServiceTap Digital» ЖШС, Алматы қ., Әл-Фараби даңғылы 77/7",
    lang: "KZ",
    // Additional translations
    repairServices: "Жөндеу қызметтері",
    builtConfigs: "Дайын конфигурациялар",
    budgetConfig: "Бюджеттік",
    optimalConfig: "Оңтайлы",
    ultimateConfig: "Құлпыртулы",
    serviceMarket: "Service Market",
    selectCategory: "Санатты таңдаңыз",
    liveSearch: "Жағдайсыз техниканы іздеңіз...",
    noProducts: "Өнімдер табылмады",
    price: "Баға",
    addToCart: "Себетке қосу",
    returnToMarket: "Маркетке оралу",
    backButton: "Маркетке оралу",
    rating: "рейтинг",
    features: "Негіздегі мүмкіндіктер",
    recommended: "Ұсынылған өнімдер",
    guaranteeCheck: "Кепілдік тексеру",
    personalCabinet: "Өзінің кабинеті",
    // Categories
    allCategory: "Барлығы",
    smartphonesCategory: "Смартфондар",
    laptopsCategory: "Ноутбуктар",
    componentsCategory: "Компоненттер",
  },
  en: {
    home: "Home", repair: "Repair", build: "Build", market: "Market", cabinet: "Dashboard",
    heroTitle: "TECH SERVICE", heroSub: "Professional repair and custom builds in Kazakhstan.",
    startBtn: "Start Repair", buildBtn: "Build PC",
    aiConsultant: "AI Consultant", aiWelcome: "Hello! How can I help you?",
    warrantyTitle: "Warranty Check", warrantyPlaceholder: "Enter serial number (S/N)",
    warrantyCheck: "Check", footerReks: "ServiceTap Digital LLP, Almaty, Al-Farabi Ave 77/7",
    lang: "EN",
    // Additional translations
    repairServices: "Repair Services",
    builtConfigs: "Ready-made Configurations",
    budgetConfig: "Budget",
    optimalConfig: "Optimal",
    ultimateConfig: "Ultimate",
    serviceMarket: "Service Market",
    selectCategory: "Select Category",
    liveSearch: "Live search for equipment...",
    noProducts: "No products found",
    price: "Price",
    addToCart: "Add to Cart",
    returnToMarket: "Return to Market",
    backButton: "Return to Market",
    rating: "rating",
    features: "Key Features",
    recommended: "Recommended Products",
    guaranteeCheck: "Warranty Check",
    personalCabinet: "Personal Cabinet",
    // Categories
    allCategory: "All",
    smartphonesCategory: "Smartphones",
    laptopsCategory: "Laptops",
    componentsCategory: "Components",
  }
};

function App() {
  const [lang, setLang] = useState('ru');
  const [isDark, setIsDark] = useState(true);

  const t = translations[lang];

  return (
    <CartProvider>
      <Router>
        <Layout lang={lang} setLang={setLang} isDark={isDark} setIsDark={setIsDark} t={t}>
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/repair" element={<Repair t={t} isDark={isDark} />} />
            <Route path="/build" element={<Build t={t} isDark={isDark} />} />
            <Route path="/market" element={<Market t={t} isDark={isDark} />} />
            <Route path="/product/:productId" element={<ProductDetail isDark={isDark} t={t} />} />
            <Route path="/warranty" element={<Warranty t={t} isDark={isDark} />} />
            <Route path="/dashboard" element={<Dashboard t={t} isDark={isDark} />} />
            <Route path="/checkout" element={<Checkout isDark={isDark} t={t} />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;