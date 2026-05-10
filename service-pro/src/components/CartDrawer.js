import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isDark, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, tax, discount, total, removeFromCart, updateQuantity, promoCode } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        } ${isDark ? 'bg-black/50' : 'bg-black/30'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-300 ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        } ${isDark ? 'bg-[#0f0f12]' : 'bg-white'} shadow-2xl`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-[#00f2ff]/10' : 'bg-[#00f2ff]/5'}`}>
              <ShoppingBag size={24} className="text-[#00f2ff]" />
            </div>
            <div>
              <h2 className="text-xl font-black">Корзина</h2>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-black/20' : 'bg-gray-50/30'}`}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
              <div className={`p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <ShoppingBag size={48} className={isDark ? 'text-white/20' : 'text-black/20'} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black mb-2">Корзина пуста</h3>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  Добавьте товары, чтобы начать покупки
                </p>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/market');
                }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl hover:scale-105 transition-all"
              >
                Перейти в магазин
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-xl transition-all ${
                    isDark ? 'bg-[#0f0f12] border border-white/5' : 'bg-white border border-black/5'
                  }`}
                >
                  {/* Product Image */}
                  <div className={`w-20 h-20 rounded-lg flex-shrink-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className="w-full h-full flex items-center justify-center text-[#00f2ff] font-black">
                      {item.name?.charAt(0)}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm line-clamp-2 mb-1">{item.name}</h4>
                    <p className="text-lg font-black text-[#00f2ff]">{item.price}</p>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`p-1 rounded-lg transition-all ${
                          isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                        }`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`p-1 rounded-lg transition-all ${
                          isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                        }`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-red-600'
                    }`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {items.length > 0 && (
          <div className={`border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            {/* Totals */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>Подитого:</span>
                <span className="font-bold">{subtotal.toLocaleString('ru-RU')} ₸</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>Налог (8%):</span>
                <span className="font-bold">{tax.toLocaleString('ru-RU')} ₸</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                  <span>Скидка {promoCode && `(${promoCode})`}:</span>
                  <span>-{discount.toLocaleString('ru-RU')} ₸</span>
                </div>
              )}

              <div className={`flex justify-between text-lg font-black pt-3 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <span>Итого:</span>
                <span className="text-[#00f2ff]">{total.toLocaleString('ru-RU')} ₸</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="p-4 space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Оформить заказ
              </button>
              <button
                onClick={handleClose}
                className={`w-full py-3 rounded-xl font-black transition-all ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-white'
                    : 'bg-black/5 hover:bg-black/10 text-black'
                }`}
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
