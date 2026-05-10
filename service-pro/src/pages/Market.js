import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Scale } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import ComparisonTable from '../components/ComparisonTable';
import { useCart } from '../context/CartContext';

const Market = ({ isDark, t }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({ brands: [], priceRange: [0, 1500000], rating: null });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState('');

  const categories = [
    { id: 'all', label: t?.allCategory || 'Все' },
    { id: 'smartphones', label: t?.smartphonesCategory || 'Смартфоны' },
    { id: 'laptops', label: t?.laptopsCategory || 'Ноутбуки' },
    { id: 'components', label: t?.componentsCategory || 'Железо' },
  ];

  const products = [
    { 
      id: 1, 
      name: "iPhone 15 Pro Max", 
      category: "smartphones", 
      price: "450 000 ₸", 
      rating: 4.8, 
      specs: "A17 Pro, 256GB, Blue Titanium", 
      stock: "Almaty, Astana",
      fullSpecs: [
        { category: "Процессор", label: "Чип", value: "A17 Pro", hasFeature: true },
        { category: "Память", label: "ОЗУ", value: "6GB", hasFeature: true },
        { category: "Память", label: "Хранилище", value: "256GB", hasFeature: true },
        { category: "Дисплей", label: "Размер экрана", value: "6.7 дюймов", hasFeature: true },
        { category: "Камера", label: "Основная камера", value: "48MP", hasFeature: true },
        { category: "Защита", label: "IP68 водозащита", value: "Есть", hasFeature: true },
      ]
    },
    { 
      id: 2, 
      name: "MacBook Pro M3 14\"", 
      category: "laptops", 
      price: "980 000 ₸", 
      rating: 4.9, 
      specs: "M3 Chip, 16GB RAM, 512GB SSD", 
      stock: "Almaty",
      fullSpecs: [
        { category: "Процессор", label: "Чип", value: "Apple M3", hasFeature: true },
        { category: "Память", label: "ОЗУ", value: "16GB", hasFeature: true },
        { category: "Память", label: "Хранилище", value: "512GB SSD", hasFeature: true },
        { category: "Дисплей", label: "Размер экрана", value: "14 дюймов", hasFeature: true },
        { category: "Батарея", label: "Автономность", value: "17+ часов", hasFeature: true },
        { category: "GPU", label: "Графика", value: "10-ядерный GPU", hasFeature: true },
      ]
    },
    { 
      id: 3, 
      name: "RTX 4090 Founders", 
      category: "components", 
      price: "1 150 000 ₸", 
      rating: 5.0, 
      specs: "24GB GDDR6X, DLSS 3.5", 
      stock: "Astana",
      fullSpecs: [
        { category: "GPU", label: "Объем памяти", value: "24GB GDDR6X", hasFeature: true },
        { category: "Архитектура", label: "Поколение", value: "Ada", hasFeature: true },
        { category: "Интерфейс", label: "PCIe", value: "PCIe 4.0", hasFeature: true },
        { category: "Производительность", label: "DLSS 3", value: "Поддерживает", hasFeature: true },
        { category: "Охлаждение", label: "Тип", value: "Пассивное", hasFeature: true },
      ]
    },
    { 
      id: 4, 
      name: "Samsung S24 Ultra", 
      category: "smartphones", 
      price: "520 000 ₸", 
      rating: 4.7, 
      specs: "Snapdragon 8 Gen 3, 512GB", 
      stock: "Shymkent, Almaty",
      fullSpecs: [
        { category: "Процессор", label: "Чип", value: "Snapdragon 8 Gen 3", hasFeature: true },
        { category: "Память", label: "ОЗУ", value: "12GB", hasFeature: true },
        { category: "Память", label: "Хранилище", value: "512GB", hasFeature: true },
        { category: "Дисплей", label: "Размер экрана", value: "6.8 дюймов", hasFeature: true },
        { category: "Камера", label: "Основная камера", value: "200MP", hasFeature: true },
        { category: "Защита", label: "IP68 водозащита", value: "Есть", hasFeature: true },
      ]
    },
  ];

  const filtered = products.filter(p => {
    const inCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = parseInt(p.price) <= filters.priceRange[1];
    
    return inCategory && matchesSearch && matchesPrice;
  });

  const handleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, product]);
    }
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product.name);
    // Здесь будет логика добавления в корзину
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        {/* Header */}
        <div className="space-y-8">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
              {t?.serviceMarket || 'Service Market'}
            </h2>
            <p className={`text-sm font-bold opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
              Найдите лучшую технику для ваших потребностей
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#00f2ff] text-black'
                    : isDark
                    ? 'bg-white/5 border border-white/10 hover:border-white/20'
                    : 'bg-black/5 border border-black/10 hover:border-black/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className={`relative w-full ${isDark ? 'bg-[#0f0f12]' : 'bg-white'}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
            <input
              type="text"
              placeholder={t?.liveSearch || "Живой поиск техники..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-6 py-4 rounded-2xl border outline-none focus:border-[#00f2ff] font-bold transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-black/10 text-black'
              }`}
            />
          </div>
        </div>

        {/* Comparison Bar */}
        {compareList.length > 0 && (
          <div className={`sticky top-4 z-40 p-4 rounded-[2rem] border flex items-center justify-between backdrop-blur-xl ${
            isDark 
              ? 'bg-[#0f0f12]/95 border-[#00f2ff]/30' 
              : 'bg-white/95 border-[#00f2ff]/20'
          } shadow-xl`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale size={16} className="text-[#00f2ff]" />
                <span className="text-sm font-black uppercase">Сравнение:</span>
              </div>
              <div className="flex gap-2">
                {compareList.map(product => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      isDark 
                        ? 'bg-[#00f2ff]/20 text-[#00f2ff]' 
                        : 'bg-[#00f2ff]/10 text-black'
                    }`}
                  >
                    {product.name}
                    <button
                      onClick={() => handleCompare(product)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowComparison(true)}
              disabled={compareList.length < 2}
              className={`px-6 py-2 font-black uppercase rounded-xl text-sm transition-all ${
                compareList.length >= 2
                  ? 'bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black hover:scale-105'
                  : 'bg-white/10 opacity-50 cursor-not-allowed'
              }`}
            >
              Сравнить ({compareList.length})
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters 
              isDark={isDark} 
              onFilterChange={setFilters}
              t={t}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <div key={product.id} className="flex flex-col h-full">
                    <div 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 cursor-pointer"
                    >
                      <ProductCard
                        product={product}
                        isDark={isDark}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: parseInt(product.price),
                          quantity: 1
                        });
                        setNotificationProduct(product.name);
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 2000);
                      }}
                      className="w-full mt-4 px-4 py-3 bg-[#00f2ff] text-black font-black rounded-xl hover:scale-105 transition-all uppercase text-sm"
                    >
                      Добавить в корзину
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 font-black uppercase mb-4">
                  {t?.noProducts || 'Товары не найдены'}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-[#00f2ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                >
                  Показать все товары
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <ComparisonTable
          products={compareList}
          isDark={isDark}
          t={t}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 left-6 bg-emerald-500 text-white px-6 py-4 rounded-xl font-black shadow-2xl animate-bounce">
          ✓ "{notificationProduct}" добавлено в корзину!
        </div>
      )}
    </div>
  );
};

export default Market;