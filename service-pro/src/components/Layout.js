import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User, Sun, Moon, ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';

const Layout = ({ children, lang, setLang, isDark, setIsDark, t }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const NavItem = ({ to, label }) => (
    <Link
      to={to}
      className="text-sm font-black uppercase tracking-widest transition-all hover:text-[#00f2ff]"
    >
      {label}
    </Link>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans flex flex-col ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-white text-black'}`}>

      {/* Header */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-xl px-6 py-4 flex items-center justify-between ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/80 border-black/10'}`}>
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-[#00f2ff] rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]">
            <Settings size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter hidden sm:block italic">SERVICETAP.KZ</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavItem to="/" label={t.home} />
          <NavItem to="/repair" label={t.repair} />
          <NavItem to="/build" label={t.build} />
          <NavItem to="/market" label={t.market} />
          <NavItem to="/warranty" label="Гарантия" />
        </nav>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCartOpen(true)} 
            className="relative p-2.5 rounded-full hover:bg-white/5 transition-all"
            title="Shopping Cart"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#00f2ff] text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <div className="flex gap-1 border border-white/10 rounded-full p-1">
            <button 
              onClick={() => setLang('ru')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${lang === 'ru' ? 'bg-[#00f2ff] text-black' : 'hover:bg-white/5'}`}
            >
              RU
            </button>
            <button 
              onClick={() => setLang('kz')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${lang === 'kz' ? 'bg-[#00f2ff] text-black' : 'hover:bg-white/5'}`}
            >
              KZ
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#00f2ff] text-black' : 'hover:bg-white/5'}`}
            >
              EN
            </button>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full hover:bg-white/5 transition-all">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/dashboard" className="p-2.5 rounded-full hover:bg-white/5 transition-all">
            <User size={18} />
          </Link>
        </div>
        
        <CartDrawer isDark={isDark} isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className={`border-t ${isDark ? 'bg-black border-white/5' : 'bg-gray-50 border-black/5'} px-6 py-12 mt-auto`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-black italic uppercase mb-4">ServiceTap.KZ</h4>
            <p className="text-xs opacity-60 leading-relaxed">
              {lang === 'en' ? 'Professional repair and custom builds of electronics in Kazakhstan.' : 
               lang === 'kz' ? 'Қазақстандағы электроника жөндеу және кастомды құрастыру қызметтері.' :
               'Профессиональный ремонт и кастомные сборки электроники в Казахстане.'}
            </p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{lang === 'en' ? 'Contacts' : lang === 'kz' ? 'Байланыстар' : 'Контакты'}</h4>
            <p className="text-xs opacity-60">Almaty: +7 (727) 123-45-67</p>
            <p className="text-xs opacity-60">Astana: +7 (717) 222-33-44</p>
            <p className="text-xs opacity-60">Shymkent: +7 (702) 555-66-77</p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{lang === 'en' ? 'Addresses' : lang === 'kz' ? 'Мекендемелер' : 'Адреса'}</h4>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Almaty - MegaCenter on Rozybakyeva 247' : lang === 'kz' ? 'Алматы - Розыбакиева 247 МегаЦентр' : 'Алматы - МегаЦентр на Розыбакиева 247'}</p>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Astana - TRC Keruen, Dostyk 9' : lang === 'kz' ? 'Астана - ТРЦ Керуен, Достық 9' : 'Астана - ТРЦ Керуен, Достык 9'}</p>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Shymkent - Plaza, Al-Farabi 3/1' : lang === 'kz' ? 'Шымкент - Plaza, Әл-Фараби 3/1' : 'Шымкент - Plaza, Аль-Фараби 3/1'}</p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{lang === 'en' ? 'Working Hours' : lang === 'kz' ? 'Істік уақыты' : 'Время работы'}</h4>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Mon-Fri: 10:00 - 20:00' : lang === 'kz' ? 'Дс-Жм: 10:00 - 20:00' : 'Пн-Пт: 10:00 - 20:00'}</p>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Sat-Sun: 11:00 - 19:00' : lang === 'kz' ? 'Сб-Жк: 11:00 - 19:00' : 'Сб-Вс: 11:00 - 19:00'}</p>
            <p className="text-xs opacity-60">{lang === 'en' ? 'Holidays: closed' : lang === 'kz' ? 'Мерекелер: жабық' : 'Праздники: выходной'}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-[10px] font-black uppercase opacity-30">© 2026 ServiceTap Digital. {lang === 'en' ? 'All rights reserved.' : lang === 'kz' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}</p>
          <p className="text-[10px] opacity-20 mt-2">{lang === 'en' ? 'Almaty, Al-Farabi Ave 77/7' : lang === 'kz' ? 'Алматы, Әл-Фараби даңғылы 77/7' : 'г. Алматы, пр. Аль-Фараби 77/7'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;