import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, Scale } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import ComparisonTable from '../components/ComparisonTable';
import productsData from '../data/products';
import { listProducts } from '../utils/productService';
import { listMarketInventory } from '../utils/inventoryService';

const Market = ({ isDark }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({ brands: [], priceRange: [0, 1500000], rating: null });

  const categories = [
    { id: 'all', label: t('market.all') },
    { id: 'smartphones', label: t('market.smartphones') },
    { id: 'laptops', label: t('market.laptops') },
    { id: 'components', label: t('market.components') }
  ];

  const [marketProducts, setMarketProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [apiProducts, marketInventory] = await Promise.all([
          listProducts().catch(() => []),
          listMarketInventory().catch(() => [])
        ]);

        const catalogMap = new Map();
        [...productsData, ...(apiProducts || [])].forEach((product) => {
          if (!product?.id) return;
          catalogMap.set(String(product.id), product);
        });

        const byProductId = (marketInventory || []).reduce((acc, row) => {
          const key = String(row.product_id);
          if (!acc[key]) acc[key] = [];
          acc[key].push(row);
          return acc;
        }, {});

        const activeProducts = Object.entries(byProductId)
          .map(([productId, rows]) => {
            const product = catalogMap.get(String(productId));
            if (!product) return null;
            const minPrice = Math.min(...rows.map((row) => Number(row.price) || 0).filter((price) => price > 0));
            return {
              ...product,
              price: Number.isFinite(minPrice) ? minPrice : product.price,
              stock: `${rows.length} center${rows.length > 1 ? 's' : ''}`,
              centerCount: rows.length,
              serviceCenterId: rows[0]?.service_center_id || null,
              inventoryRows: rows
            };
          })
          .filter(Boolean);

        setMarketProducts(activeProducts);
      } catch (error) {
        setMarketProducts([]);
      }
    };
    loadProducts();
    const syncTimer = setInterval(loadProducts, 15000);
    return () => clearInterval(syncTimer);
  }, []);

  const products = marketProducts;

  const filtered = products.filter(p => {
    const inCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= filters.priceRange[1];
    const matchesRating = filters.rating ? Math.floor(p.rating) >= filters.rating : true;
    
    return inCategory && matchesSearch && matchesPrice && matchesRating;
  });

  const handleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, product]);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        {/* Header */}
        <div className="space-y-8">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
              {t('market.title')}
            </h2>
            <p className={`text-sm font-bold opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
              {t('market.subtitle')}
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
                placeholder={t('market.liveSearch')}
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
                  <span className="text-sm font-black uppercase">{t('market.compare')}:</span>
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
              {t('market.compare')} ({compareList.length})
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
                        onCompare={handleCompare}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 font-black uppercase mb-4">
                  {t('market.noProducts')}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-primary text-black font-black rounded-xl hover:scale-105 transition-all"
                >
                  {t('market.showAll')}
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
    </div>
  );
};

export default Market;