import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, Trash2, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const CartDrawer = ({ isDark, isOpen, onClose }) => {
  const { t } = useTranslation();
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
        className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        } ${isDark ? 'bg-black/50' : 'bg-black/30'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[380px] z-[110] flex flex-col transition-transform duration-300 ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        } ${isDark ? 'bg-[#0f0f12]' : 'bg-[#e9edf1]'} shadow-2xl`}
      >
        <div className={`m-4 h-[calc(100%-2rem)] flex flex-col rounded-3xl overflow-hidden ${isDark ? 'bg-[#0f0f12]' : 'bg-white'} shadow-lg border ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-5 border-b ${isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5' : 'bg-[#f7f8fa]'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-[#00f2ff]/10' : 'bg-[#00f2ff]/15'}`}>
              <ShoppingBag size={24} className="text-[#00f2ff]" />
            </div>
            <div>
              <h2 className="text-lg font-black">{t('common.cart')}</h2>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {t('cart.items', { count: itemCount })}
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
        <div className={`flex-1 overflow-y-auto px-4 pb-4 ${isDark ? 'bg-black/20' : 'bg-white'}`}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
              <div className={`p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <ShoppingBag size={48} className={isDark ? 'text-white/20' : 'text-black/20'} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black mb-2">{t('cart.emptyTitle')}</h3>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  {t('cart.emptySubtitle')}
                </p>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/market');
                }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl hover:scale-105 transition-all"
              >
                {t('cart.goMarket')}
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-2xl transition-all shadow-sm ${
                    isDark ? 'bg-[#0f0f12] border border-white/10' : 'bg-white border border-black/10'
                  }`}
                >
                  {/* Product Image */}
                  <div className={`w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#00f2ff] font-black">
                        {item.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-black text-sm line-clamp-2">{item.name}</h4>
                        {item.description && (
                          <p className={`text-[11px] line-clamp-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                            {item.description}
                          </p>
                        )}
                        {item.rating && (
                          <div className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'}`}>
                            <span>★</span>
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-1 rounded-lg transition-all ${
                          isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-500/10 text-red-600'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-base font-black text-primary">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`p-1 rounded-lg transition-all ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                          }`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`p-1 rounded-lg transition-all ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                          }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {items.length > 0 && (
          <div className={`border-t ${isDark ? 'border-white/10' : 'border-black/10'} ${isDark ? 'bg-white/5' : 'bg-white'}`}>
            {/* Totals */}
            <div className="px-6 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>{t('checkout.subtotal')}:</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>{t('checkout.tax')} (8%):</span>
                <span className="font-bold">{formatPrice(tax)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                  <span>Скидка {promoCode && `(${promoCode})`}:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className={`flex justify-between text-lg font-black pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <span>{t('checkout.total')}:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {t('checkout.title')}
              </button>
              <button
                onClick={handleClose}
                className={`w-full py-3 rounded-xl font-black transition-all ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-white'
                    : 'bg-[#f0f1f3] hover:bg-[#e6e8eb] text-black'
                }`}
              >
                {t('checkout.continueShopping')}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
