import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingBag, Scale, MapPin, Check } from 'lucide-react';
import { formatPrice } from '../utils/format';

const ProductCard = ({ product, isDark, onCompare }) => {
  const { t } = useTranslation();
  const coverImage = product?.image || product?.images?.[0] || '';
  return (
    <div
      className={`group flex flex-col p-6 rounded-[2.5rem] border transition-all hover:-translate-y-2 h-full ${
        isDark
          ? 'bg-[#0f0f12] border-white/5 hover:border-[#00f2ff]/30'
          : 'bg-white border-black/5 shadow-lg hover:shadow-2xl'
      }`}
    >
      {/* Image Placeholder with Actions */}
      <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 mb-6 flex items-center justify-center relative overflow-hidden group-hover:from-[#00f2ff]/20 group-hover:to-[#7000ff]/20 transition-all">
        {coverImage ? (
          <img src={coverImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ShoppingBag className="w-16 h-16 opacity-20 group-hover:scale-125 transition-transform" />
        )}
        
        {/* Overlay with Quick Actions */}
        <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare?.(product);
            }}
            className="p-3 bg-white/10 backdrop-blur hover:bg-white/20 rounded-xl transition-all"
          >
            <Scale size={20} className="text-[#00f2ff]" />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" size={12} />
          <span className="text-[10px] font-black">{product.rating}</span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500/80 text-white text-[10px] font-black rounded-full flex items-center gap-1">
          <Check size={12} />
          {t('market.inStock')}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-black italic uppercase text-lg mb-2 leading-tight line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] font-bold opacity-50 uppercase mb-3 line-clamp-2">
          {product.specs}
        </p>
        <p className="text-xs font-bold opacity-60 mb-4 flex items-center gap-1">
          <MapPin size={14} />
          {product.stock}
        </p>
      </div>

      {/* Divider */}
      <div className={`h-[1px] mb-4 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />

      {/* Price and CTA */}
      <div className="flex items-center justify-between">
        <p className="text-2xl font-black text-primary">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
