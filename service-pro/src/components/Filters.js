import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, DollarSign, Tag, Star } from 'lucide-react';

const Filters = ({ isDark, onFilterChange }) => {
  const { t } = useTranslation();
  const [openFilter, setOpenFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const brands = ['Apple', 'Samsung', 'NVIDIA', 'Intel', 'AMD', 'Lenovo'];
  const ratings = [5, 4, 3, 2, 1];

  const handleBrandToggle = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
    onFilterChange({ brands: updated, priceRange, rating: selectedRating });
  };

  const handlePriceChange = (e) => {
    const newPrice = [0, parseInt(e.target.value)];
    setPriceRange(newPrice);
    onFilterChange({ brands: selectedBrands, priceRange: newPrice, rating: selectedRating });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    onFilterChange({ brands: selectedBrands, priceRange, rating: newRating });
  };

  const FilterSection = ({ title, children }) => (
    <div className={`border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
      <button
        onClick={() => setOpenFilter(openFilter === title ? null : title)}
        className={`w-full p-4 flex justify-between items-center font-black uppercase text-sm ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} transition-all`}
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${openFilter === title ? 'rotate-180' : ''}`}
        />
      </button>
      {openFilter === title && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );

  return (
    <div className={`rounded-[2.5rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/10'} overflow-hidden`}>
      <div className={`p-4 font-black uppercase text-lg flex items-center gap-2 ${isDark ? 'bg-white/5' : 'bg-black/5'} border-b ${isDark ? 'border-white/5' : 'border-black/10'}`}>
        <svg className="w-5 h-5 text-[#00f2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
        {t('filters.title')}
      </div>

      <FilterSection title={t('filters.price')}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#00f2ff]" />
            <span className="text-xs font-bold opacity-70">{t('market.price')}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1500000"
            step="50000"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full accent-[#00f2ff]"
          />
          <div className="flex justify-between text-xs font-bold">
            <span>0 ₸</span>
            <span className="text-[#00f2ff]">{(priceRange[1] / 1000).toFixed(0)}K ₸</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t('filters.brand')}>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 accent-[#00f2ff] cursor-pointer rounded"
              />
              <Tag size={14} className="opacity-50" />
              <span className="text-sm font-bold">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t('filters.rating')}>
        <div className="space-y-2">
          {ratings.map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all ${
                selectedRating === rating
                  ? isDark
                    ? 'bg-[#00f2ff]/20'
                    : 'bg-[#00f2ff]/10'
                  : isDark
                  ? 'hover:bg-white/5'
                  : 'hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star key={`empty-${i}`} size={12} className="text-gray-400 opacity-30" />
                ))}
              </div>
              <span className="text-xs opacity-50 ml-auto">{rating}+</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default Filters;
