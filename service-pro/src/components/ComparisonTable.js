import React, { useState } from 'react';
import { X, Check, Star, ChevronDown } from 'lucide-react';

const ComparisonTable = ({ products, isDark, t, onClose }) => {
  const [expandedSpecs, setExpandedSpecs] = useState({});

  // Объединённые характеристики из всех товаров
  const allSpecs = {};
  products.forEach(product => {
    product.fullSpecs?.forEach(spec => {
      if (!allSpecs[spec.category]) {
        allSpecs[spec.category] = {};
      }
      allSpecs[spec.category][spec.label] = true;
    });
  });

  const toggleSpec = (category) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className={`max-w-7xl w-full rounded-[2.5rem] border ${isDark ? 'bg-[#0a0a0d] border-white/10' : 'bg-white border-black/10'} overflow-hidden max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} flex justify-between items-center`}>
          <h2 className="text-2xl font-black italic uppercase">
            Сравнение товаров
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
                      <p className={`text-2xl font-black text-[#00f2ff] ${isDark ? '' : ''}`}>
                        {product.price}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
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
                    className={`border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/2'} cursor-pointer hover:bg-white/10 transition-all`}
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
                        const spec = product.fullSpecs?.find(s => s.label === specLabel);
                        return (
                          <td
                            key={`${product.id}-${specLabel}`}
                            className={`p-6 text-center text-sm min-w-[250px] ${isDark ? 'bg-[#0f0f12]/50' : 'bg-white/50'}`}
                          >
                            {spec ? (
                              <div className="flex items-center justify-center gap-2">
                                {spec.hasFeature && <Check className="text-emerald-500" size={18} />}
                                <span className={spec.hasFeature ? 'font-bold text-emerald-500' : 'opacity-50'}>
                                  {spec.value}
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
                    <button className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl uppercase text-sm hover:scale-105 transition-all">
                      Купить
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
