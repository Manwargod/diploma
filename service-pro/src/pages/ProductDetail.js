import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Check, MapPin } from 'lucide-react';

const ProductDetail = ({ isDark, t }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Все товары из маркета
  const products = [
    { id: 1, name: "iPhone 15 Pro Max", category: "smartphones", price: "450 000 ₸", rating: 4.8, specs: "A17 Pro, 256GB, Blue Titanium", stock: "Almaty, Astana", description: "Последнее поколение iPhone с потрясающей камерой и производительностью.", features: ["Экран 6.7 дюймов", "A17 Pro чип", "256GB памяти", "Керамический щит", "IP68 защита", "USB-C"] },
    { id: 2, name: "MacBook Pro M3 14\"", category: "laptops", price: "980 000 ₸", rating: 4.9, specs: "M3 Chip, 16GB RAM, 512GB SSD", stock: "Almaty", description: "Мощный ноутбук для профессионалов с новым чипом M3.", features: ["14\" дисплей Retina", "M3 чип", "16GB объединённая память", "512GB SSD", "10-ядерный GPU", "До 17 часов автономности"] },
    { id: 3, name: "RTX 4090 Founders", category: "components", price: "1 150 000 ₸", rating: 5.0, specs: "24GB GDDR6X, DLSS 3.5", stock: "Astana", description: "Флагманская видеокарта NVIDIA для максимальной производительности в играх и 3D.", features: ["24GB GDDR6X VRAM", "DLSS 3.5 поддержка", "Ada архитектура", "PCIe 4.0", "Эталонный дизайн", "Пассивное охлаждение"] },
    { id: 4, name: "Samsung S24 Ultra", category: "smartphones", price: "520 000 ₸", rating: 4.7, specs: "Snapdragon 8 Gen 3, 512GB", stock: "Shymkent, Almaty", description: "Премиум смартфон Samsung с лучшей камерой и производительностью.", features: ["6.8\" дисплей AMOLED", "Snapdragon 8 Gen 3", "512GB памяти", "Камера 200MP", "IP68 водозащита", "Быстрая зарядка 45W"] },
  ];

  const product = products.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-4xl font-black italic uppercase">{t?.selectCategory ? 'Product Not Found' : 'Товар не найден'}</h2>
        <button
          onClick={() => navigate('/market')}
          className="px-8 py-4 bg-[#00f2ff] text-black font-black rounded-xl uppercase hover:scale-105 transition-all"
        >
          {t?.returnToMarket || 'Вернуться в маркет'}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/market')}
          className="flex items-center gap-2 text-[#00f2ff] font-black uppercase hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} />
          {t?.backButton || 'Вернуться в маркет'}
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className={`flex items-center justify-center rounded-[3rem] border aspect-square ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
            <ShoppingBag className="w-32 h-32 opacity-20" />
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
                  />
                ))}
              </div>
              <span className="text-lg font-black">{product.rating}</span>
              <span className="text-sm opacity-50 font-bold">(324 отзыва)</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <p className="text-sm font-bold opacity-50 uppercase mb-2">{t?.price || 'Цена'}</p>
              <p className="text-4xl font-black text-[#00f2ff]">{product.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <Check className="text-emerald-500" size={24} />
              <div>
                <p className="font-black uppercase text-sm">В наличии</p>
                <p className="text-sm opacity-50 flex items-center gap-1">
                  <MapPin size={14} />
                  {product.stock}
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full py-6 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-2xl uppercase italic shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg">
              <ShoppingBag size={24} />
              {t?.addToCart || 'Добавить в корзину'}
            </button>

            {/* Specs */}
            <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
              <p className="font-black uppercase text-sm mb-4 opacity-50">{t?.selectCategory ? 'Specifications' : 'Характеристики'}</p>
              <p className="text-lg font-bold">{product.specs}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          <h2 className="text-3xl font-black italic uppercase mb-8">{t?.features || 'Основные возможности'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#00f2ff] text-black flex items-center justify-center flex-shrink-0 mt-1">
                  <Check size={16} />
                </div>
                <p className="font-bold text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-black italic uppercase mb-8">{t?.recommended || 'Рекомендованные товары'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className={`group flex flex-col p-6 rounded-[2.5rem] border transition-all hover:-translate-y-2 h-full cursor-pointer ${
                    isDark
                      ? 'bg-[#0f0f12] border-white/5 hover:border-[#00f2ff]/30'
                      : 'bg-white border-black/5 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 mb-6 flex items-center justify-center relative overflow-hidden group-hover:from-[#00f2ff]/20 group-hover:to-[#7000ff]/20 transition-all">
                    <ShoppingBag className="w-16 h-16 opacity-20 group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="font-black italic uppercase text-lg mb-2 leading-tight line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] font-bold opacity-50 uppercase mb-4 line-clamp-2">{p.specs}</p>
                  <div className="h-px bg-white/10 my-4"></div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-black text-[#00f2ff]">{p.price}</span>
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" size={12} />
                      <span className="text-[10px] font-black text-white">{p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
