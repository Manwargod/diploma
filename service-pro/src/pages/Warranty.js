import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, AlertCircle, Clock, Smartphone, Laptop, Package } from 'lucide-react';

const Warranty = ({ isDark }) => {
  const { t } = useTranslation();
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleWarrantyCheck = () => {
    if (!serialNumber.trim()) return;
    setSearched(true);
    
    // Имитация проверки гарантии
    setTimeout(() => {
      const hasWarranty = Math.random() > 0.3;
      setWarrantyInfo({
        serialNumber: serialNumber.toUpperCase(),
        deviceName: 'iPhone 14 Pro Max',
        purchaseDate: '15.05.2023',
        warrantyEndDate: '15.05.2025',
        daysRemaining: 234,
        status: hasWarranty ? 'active' : 'expired',
        covered: hasWarranty ? ['Заводские дефекты', 'Неисправность экрана', 'Проблемы с батареей'] : [],
      });
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-2xl flex items-center justify-center">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t('warranty.title')}</h2>
        </div>
          <p className="text-gray-500">{t('warranty.subtitle')}</p>
      </div>

      {/* Search Form */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-4`}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase opacity-60">{t('warranty.serialLabel')}</label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="A2F4E7D9"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleWarrantyCheck()}
              className="flex-grow p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all uppercase"
            />
            <button
              onClick={handleWarrantyCheck}
              disabled={!serialNumber.trim() || searched}
              className="px-8 py-4 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl uppercase hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searched ? t('warranty.checking') : t('warranty.check')}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {warrantyInfo && (
        <div className={`p-8 rounded-[2rem] border space-y-8 animate-in fade-in ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic uppercase">{t('warranty.result')}</h3>
            {warrantyInfo.status === 'active' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500 rounded-full">
                <CheckCircle size={20} className="text-emerald-500" />
                <span className="font-black text-emerald-500 uppercase text-sm">{t('warranty.active')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 rounded-full">
                <AlertCircle size={20} className="text-red-500" />
                <span className="font-black text-red-500 uppercase text-sm">{t('warranty.expired')}</span>
              </div>
            )}
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t('warranty.device')}</p>
              <p className="text-xl font-black italic">{warrantyInfo.deviceName}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t('warranty.serial')}</p>
              <p className="text-xl font-black italic font-mono">{warrantyInfo.serialNumber}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t('warranty.purchaseDate')}</p>
              <p className="text-lg font-black">{warrantyInfo.purchaseDate}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t('warranty.until')}</p>
              <p className="text-lg font-black">{warrantyInfo.warrantyEndDate}</p>
            </div>
          </div>

          {/* Warranty Timeline */}
          {warrantyInfo.status === 'active' && (
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#00f2ff]/5 border-[#00f2ff]/30' : 'bg-[#00f2ff]/5 border-[#00f2ff]/30'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-[#00f2ff]" />
                <h4 className="font-black uppercase italic">{t('warranty.remaining')}</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-[#00f2ff]">{warrantyInfo.daysRemaining}</div>
                <div className="flex-grow">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff]"
                      style={{ width: `${Math.min((warrantyInfo.daysRemaining / 730) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-50 mt-2">~ {Math.floor(warrantyInfo.daysRemaining / 30)} {t('warranty.months')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Coverage Info */}
          {warrantyInfo.status === 'active' && warrantyInfo.covered.length > 0 && (
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <h4 className="font-black uppercase italic mb-4">{t('warranty.coverage')}</h4>
              <div className="space-y-2">
                {warrantyInfo.covered.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-[#00f2ff] flex-shrink-0" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {warrantyInfo.status === 'active' && (
            <div className="text-center">
              <button className="px-12 py-4 bg-[#00f2ff] text-black font-black rounded-xl uppercase hover:scale-105 transition-all">
                {t('warranty.service')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-4`}>
        <h3 className="font-black uppercase italic">{t('warranty.howTo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-black uppercase mb-2 flex items-center gap-2"><Smartphone size={16} /> {t('warranty.smartphone')}</p>
            <p className="opacity-70">{t('warranty.smartphoneText')}</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2 flex items-center gap-2"><Laptop size={16} /> {t('warranty.laptop')}</p>
            <p className="opacity-70">{t('warranty.laptopText')}</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2 flex items-center gap-2"><Package size={16} /> {t('warranty.box')}</p>
            <p className="opacity-70">{t('warranty.boxText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;