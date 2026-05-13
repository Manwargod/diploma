import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Star, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

const ComparisonTable = ({ products, isDark, onClose }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [toast, setToast] = useState('');

  // Объединённые характеристики из всех товаров
  const allSpecs = {};
  products.forEach(product => {
    Object.entries(product.extendedSpecs || {}).forEach(([label]) => {
      if (!allSpecs['Specs']) {
        allSpecs['Specs'] = {};
      }
      allSpecs['Specs'][label] = true;
    });
  });

  const toggleSpec = (category) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getSpecState = (specLabel, productValues, currentIndex) => {
    const metricValues = productValues.map((value) => {
      const text = String(specLabel).toLowerCase();
      const raw = String(value || '').replace(/[^\d.,]/g, '').replace(',', '.');
      const number = Number(raw);
      if (!Number.isFinite(number)) return null;
      if (/(ram|memory)/i.test(text)) return number;
      if (/(storage|ssd|hdd)/i.test(text)) return number;
      if (/(battery)/i.test(text)) return number;
      if (/(camera|mp|megapixel)/i.test(text)) return number;
      if (/(display|screen)/i.test(text)) return number;
      return null;
    });

    if (metricValues.some((metric) => metric == null)) return 'neutral';
    const max = Math.max(...metricValues);
    const min = Math.min(...metricValues);
    if (max === min) return 'equal';
    return metricValues[currentIndex] === max ? 'better' : 'worse';
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className={`max-w-7xl w-full rounded-[2.5rem] border ${isDark ? 'bg-[#0a0a0d] border-white/10' : 'bg-white border-black/10'} overflow-hidden max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} flex justify-between items-center`}>
          <h2 className="text-2xl font-black italic uppercase">
            {t('market.compare')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {/* Product Names Row */}
              <tr className={`border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <td className={`p-6 font-black uppercase text-sm sticky left-0 w-48 ${isDark ? 'bg-[#0f0f12]' : 'bg-white'}`}>
                  Товар
                </td>
                {products.map(product => (
                  <td
                    key={product.id}
                    className={`p-6 text-center min-w-[250px] ${isDark ? 'bg-[#0f0f12]/50' : 'bg-white/50'}`}
                  >
                    <div className="space-y-2">
                      <h4 className="font-black uppercase text-sm line-clamp-2">{product.name}</h4>
                      <p className={`text-2xl font-black text-primary ${isDark ? '' : ''}`}>
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-white/20' : 'text-black/20'}
                          />
                        ))}
                        <span className="text-xs opacity-50 ml-1">{product.rating}</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Specifications Rows */}
              {Object.entries(allSpecs).map(([category, specs]) => (
                <React.Fragment key={category}>
                  {/* Category Header */}
                  <tr
                    className={`border-b ${isDark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-black/10 bg-black/5 hover:bg-black/10'} cursor-pointer transition-all`}
                    onClick={() => toggleSpec(category)}
                  >
                    <td colSpan={products.length + 1} className="p-6 font-black uppercase text-sm flex items-center justify-between">
                      <span>{category}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${expandedSpecs[category] ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>

                  {/* Spec Details */}
                  {expandedSpecs[category] && Object.entries(specs).map(([specLabel]) => (
                    <tr key={specLabel} className={`border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                      <td className={`p-6 text-sm font-bold opacity-70 sticky left-0 w-48 ${isDark ? 'bg-[#0f0f12]' : 'bg-white'}`}>
                        {specLabel}
                      </td>
                      {products.map(product => {
                        const value = product.extendedSpecs?.[specLabel];
                        const states = products.map((p) => p.extendedSpecs?.[specLabel]);
                        const state = getSpecState(specLabel, states, products.findIndex((p) => p.id === product.id));
                        const specClass = state === 'better' ? 'text-emerald-400' : state === 'worse' ? 'text-amber-400' : '';
                        return (
                          <td
                            key={`${product.id}-${specLabel}`}
                            className={`p-6 text-center text-sm min-w-[250px] ${isDark ? 'bg-[#0f0f12]/50' : 'bg-white/50'}`}
                          >
                            {value ? (
                              <div className={`flex items-center justify-center gap-2 ${specClass}`}>
                                {state === 'better' && <ArrowUp size={16} />}
                                {state === 'worse' && <ArrowDown size={16} />}
                                {state === 'neutral' && <Check className="text-emerald-500" size={18} />}
                                <span className={`font-bold ${specClass}`}>
                                  {value}
                                </span>
                              </div>
                            ) : (
                              <span className="opacity-20 font-bold">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Buy Button Row */}
              <tr className={`${isDark ? 'bg-white/5' : 'bg-black/2'}`}>
                <td className={`p-6 sticky left-0 w-48 ${isDark ? 'bg-[#0f0f12]' : 'bg-white'}`} />
                {products.map(product => (
                  <td key={`buy-${product.id}`} className={`p-6 text-center min-w-[250px] ${isDark ? 'bg-[#0f0f12]/50' : 'bg-white/50'}`}>
                    <button
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          description: product.description,
                          quantity: 1,
                          serviceCenterId: product.serviceCenterId || null
                        });
                        setToast(t('market.addedToCart'));
                        setTimeout(() => setToast(''), 1500);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl uppercase text-sm hover:scale-105 transition-all"
                    >
                      {t('market.addToCart')}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-black shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;
