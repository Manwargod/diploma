import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, User, Sun, Moon, ShoppingCart, LogOut, Building2, Menu, X } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, isDark, setIsDark, i18n }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const NavItem = ({ to, label }) => (
    <Link
      to={to}
      className="text-sm font-black uppercase tracking-widest transition-all hover:text-primary"
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen transition-colors duration-500 font-sans flex flex-col bg-bg text-text">

      {/* Header */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-xl px-6 py-4 flex items-center justify-between ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/90 border-black/10'}`}>
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]">
            <Settings size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter hidden sm:block italic">SERVICEPRO.KZ</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavItem to="/" label={t('common.home')} />
          <NavItem to="/repair" label={t('common.repair')} />
          <NavItem to="/build" label={t('common.build')} />
          <NavItem to="/market" label={t('common.market')} />
          <NavItem to="/warranty" label={t('common.warranty')} />
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            title={t('common.open')}
          >
            <Menu size={18} />
          </button>
          <button 
            onClick={() => setCartOpen(prev => !prev)} 
            className={`relative p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            title={t('common.cart')}
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <div className={`flex gap-1 rounded-full p-1 ${isDark ? 'border border-white/10' : 'border border-black/10'}`}>
            <button 
              onClick={() => i18n.changeLanguage('ru')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${i18n.language?.startsWith('ru') ? 'bg-primary text-black' : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              RU
            </button>
            <button 
              onClick={() => i18n.changeLanguage('kz')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${i18n.language?.startsWith('kz') ? 'bg-primary text-black' : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              KZ
            </button>
            <button 
              onClick={() => i18n.changeLanguage('en')} 
              className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${i18n.language?.startsWith('en') ? 'bg-primary text-black' : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              EN
            </button>
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to={user.role === 'provider' ? '/provider' : '/dashboard'} className={`p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title={t('common.dashboard')}>
                {user.role === 'provider' ? <Building2 size={18} /> : <User size={18} />}
              </Link>
              <button onClick={signOut} className={`p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title={t('common.cancel')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className={`p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title={t('auth.signIn')}>
              <User size={18} />
            </Link>
          )}
        </div>
        
      </header>

      <CartDrawer isDark={isDark} isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'}`} onClick={() => setMobileOpen(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] p-6 ${isDark ? 'bg-[#0f0f12] text-white' : 'bg-white text-black'} shadow-2xl flex flex-col gap-6`}>
            <div className="flex items-center justify-between">
              <span className="font-black uppercase">{t('common.open')}</span>
              <button onClick={() => setMobileOpen(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <NavItem to="/" label={t('common.home')} />
              <NavItem to="/repair" label={t('common.repair')} />
              <NavItem to="/build" label={t('common.build')} />
              <NavItem to="/market" label={t('common.market')} />
              <NavItem to="/warranty" label={t('common.warranty')} />
            </nav>
            <button
              onClick={() => setMobileOpen(false)}
              className={`mt-auto px-4 py-3 rounded-xl font-black uppercase ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className={`border-t ${isDark ? 'bg-black border-white/5' : 'bg-gray-50 border-black/5'} px-6 py-12 mt-auto`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-black italic uppercase mb-4">ServicePro.kz</h4>
            <p className="text-xs opacity-60 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{t('footer.contacts')}</h4>
            <p className="text-xs opacity-60">{t('footer.contactAlmaty')}: +7 (727) 123-45-67</p>
            <p className="text-xs opacity-60">{t('footer.contactAstana')}: +7 (717) 222-33-44</p>
            <p className="text-xs opacity-60">{t('footer.contactShymkent')}: +7 (702) 555-66-77</p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{t('footer.addresses')}</h4>
            <p className="text-xs opacity-60">{t('footer.addressAlmaty')} - MegaCenter Rozybakyeva 247</p>
            <p className="text-xs opacity-60">{t('footer.addressAstana')} - TRC Keruen, Dostyk 9</p>
            <p className="text-xs opacity-60">{t('footer.addressShymkent')} - Plaza, Al-Farabi 3/1</p>
          </div>
          <div>
            <h4 className="font-black italic uppercase mb-4">{t('footer.hours')}</h4>
            <p className="text-xs opacity-60">{t('footer.weekdays')}: 10:00 - 20:00</p>
            <p className="text-xs opacity-60">{t('footer.weekends')}: 11:00 - 19:00</p>
            <p className="text-xs opacity-60">{t('footer.holidays')}: {t('footer.closed')}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-[10px] font-black uppercase opacity-30">© 2026 ServicePro.kz. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;