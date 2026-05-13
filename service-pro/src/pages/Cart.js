// //import React from 'react';
// //import { useNavigate } from 'react-router-dom';
// //import { useTranslation } from 'react-i18next';
// //import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
// //import { useCart } from '../context/CartContext';
// //import { formatPrice } from '../utils/format';

// //const Cart = ({ isDark }) => {
//   //const { t } = useTranslation();
//   //const navigate = useNavigate();
//   //const { items, subtotal, tax, discount, total, removeFromCart, updateQuantity, clearCart, promoCode } = useCart();

//   //return (
//     //<div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
//       //<div className="max-w-7xl mx-auto px-6 py-10">
//         //<button
//           //onClick={() => navigate(-1)}
//           //className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl font-black uppercase text-sm transition-all ${
//             //isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
//           //}`}
//         //>
//           <ArrowLeft size={16} />
//           {t('common.back')}
//         </button>

//         <div className="flex items-center gap-3 mb-8">
//           <ShoppingBag className="text-primary" size={32} />
//           <div>
//             <h1 className="text-4xl font-black italic uppercase">{t('common.cart')}</h1>
//             <p className={`text-sm font-bold opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
//               {t('cart.items', { count: items.length })}
//             </p>
//           </div>
//         </div>

//         {items.length === 0 ? (
//           <div className={`rounded-3xl border p-10 text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white'}`}>
//             <p className="text-xl font-black mb-3">{t('cart.emptyTitle')}</p>
//             <p className={`mb-6 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{t('cart.emptySubtitle')}</p>
//             <button
//               onClick={() => navigate('/market')}
//               className="px-6 py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl"
//             >
//               {t('cart.goMarket')}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
//             <div className="space-y-4">
//               {items.map((item) => (
//                 <div
//                   key={item.id}
//                   className={`rounded-3xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white shadow-sm'}`}
//                 >
//                   <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
//                     {item.image ? (
//                       <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
//                     ) : (
//                       <span className="text-primary font-black text-xl">{item.name?.charAt(0)}</span>
//                     )}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-black text-lg uppercase line-clamp-2">{item.name}</h3>
//                     {item.description && (
//                       <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
//                         {item.description}
//                       </p>
//                     )}
//                     <p className="mt-3 text-primary font-black text-lg">{formatPrice(item.price)}</p>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <div className={`inline-flex items-center rounded-2xl border ${isDark ? 'border-white/10' : 'border-black/10'}`}>
//                       <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2">
//                         <Minus size={16} />
//                       </button>
//                       <span className="px-3 font-black min-w-10 text-center">{item.quantity}</span>
//                       <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2">
//                         <Plus size={16} />
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="p-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <aside className={`rounded-3xl border p-6 h-fit sticky top-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white shadow-sm'}`}>
//               <h2 className="text-2xl font-black uppercase mb-6">{t('checkout.summary')}</h2>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between"><span>{t('checkout.subtotal')}</span><span>{formatPrice(subtotal)}</span></div>
//                 <div className="flex justify-between"><span>{t('checkout.tax')}</span><span>{formatPrice(tax)}</span></div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-emerald-500 font-bold">
//                     <span>Скидка {promoCode ? `(${promoCode})` : ''}</span><span>-{formatPrice(discount)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-lg font-black pt-3 border-t border-current/10">
//                   <span>{t('checkout.total')}</span><span className="text-primary">{formatPrice(total)}</span>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-3">
//                 <button
//                   onClick={() => navigate('/checkout')}
//                   className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-2xl"
//                 >
//                   {t('common.checkout')}
//                 </button>
//                 <button
//                   onClick={clearCart}
//                   className={`w-full py-3 rounded-2xl font-black ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
//                 >
//                   {t('common.cancel')}
//                 </button>
//               </div>
//             </aside>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
