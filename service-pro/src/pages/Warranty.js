import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Warranty = ({ t, isDark }) => {
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
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t?.buildBtn === 'Build PC' ? 'Warranty Check' : t?.buildBtn === 'ПК жинау' ? 'Кепілдікті тексеру' : 'Проверка гарантии'}</h2>
        </div>
        <p className="text-gray-500">{t?.buildBtn === 'Build PC' ? 'Enter the serial number of your device' : t?.buildBtn === 'ПК жинау' ? 'Оны құрылғының серийлык номерін енгізіңіз' : 'Введите серийный номер вашего устройства'}</p>
      </div>

      {/* Search Form */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-4`}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Serial Number (S/N) or IMEI' : t?.buildBtn === 'ПК жинау' ? 'Серийлык номер (S/N) немесе IMEI' : 'Серийный номер (S/N) или IMEI'}</label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t?.buildBtn === 'Build PC' ? 'For example: A2F4E7D9...' : t?.buildBtn === 'ПК жинау' ? 'Мысалы: A2F4E7D9...' : 'Например: A2F4E7D9...'}
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
              {searched ? (t?.buildBtn === 'Build PC' ? 'Checking...' : t?.buildBtn === 'ПК жинау' ? 'Тексерілу...' : 'Проверка...') : (t?.buildBtn === 'Build PC' ? 'Check' : t?.buildBtn === 'ПК жинау' ? 'Тексеру' : 'Проверить')}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {warrantyInfo && (
        <div className={`p-8 rounded-[2rem] border space-y-8 animate-in fade-in ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'}`}>
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Check Result' : t?.buildBtn === 'ПК жинау' ? 'Тексерің нәтижесі' : 'Результат проверки'}</h3>
            {warrantyInfo.status === 'active' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500 rounded-full">
                <CheckCircle size={20} className="text-emerald-500" />
                <span className="font-black text-emerald-500 uppercase text-sm">{t?.buildBtn === 'Build PC' ? 'Warranty Active' : t?.buildBtn === 'ПК жинау' ? 'Кепілдік іс істейді' : 'Гарантия активна'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 rounded-full">
                <AlertCircle size={20} className="text-red-500" />
                <span className="font-black text-red-500 uppercase text-sm">{t?.buildBtn === 'Build PC' ? 'Warranty Expired' : t?.buildBtn === 'ПК жинау' ? 'Кепілдік ўтіп салы' : 'Гарантия истекла'}</span>
              </div>
            )}
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t?.buildBtn === 'Build PC' ? 'Device' : t?.buildBtn === 'ПК жинау' ? 'Оны' : 'Устройство'}</p>
              <p className="text-xl font-black italic">{warrantyInfo.deviceName}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t?.buildBtn === 'Build PC' ? 'Serial Number' : t?.buildBtn === 'ПК жинау' ? 'Серийлык номер' : 'Серийный номер'}</p>
              <p className="text-xl font-black italic font-mono">{warrantyInfo.serialNumber}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t?.buildBtn === 'Build PC' ? 'Purchase Date' : t?.buildBtn === 'ПК жинау' ? 'Саты олдылы' : 'Дата покупки'}</p>
              <p className="text-lg font-black">{warrantyInfo.purchaseDate}</p>
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <p className="text-xs font-black uppercase opacity-50 mb-2">{t?.buildBtn === 'Build PC' ? 'Warranty Until' : t?.buildBtn === 'ПК жинау' ? 'Кепілдік ўнге дейін' : 'Гарантия до'}</p>
              <p className="text-lg font-black">{warrantyInfo.warrantyEndDate}</p>
            </div>
          </div>

          {/* Warranty Timeline */}
          {warrantyInfo.status === 'active' && (
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#00f2ff]/5 border-[#00f2ff]/30' : 'bg-[#00f2ff]/5 border-[#00f2ff]/30'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-[#00f2ff]" />
                <h4 className="font-black uppercase italic">{t?.buildBtn === 'Build PC' ? 'Warranty Days Remaining' : t?.buildBtn === 'ПК жинау' ? 'Кепілдік күннері қалды' : 'Осталось дней гарантии'}</h4>
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
                  <p className="text-xs opacity-50 mt-2">Примерно {Math.floor(warrantyInfo.daysRemaining / 30)} месяцев</p>
                </div>
              </div>
            </div>
          )}

          {/* Coverage Info */}
          {warrantyInfo.status === 'active' && warrantyInfo.covered.length > 0 && (
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
              <h4 className="font-black uppercase italic mb-4">Что покрывает гарантия:</h4>
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
                Оформить гарантійне обслуговування
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-4`}>
        <h3 className="font-black uppercase italic">Как найти серийный номер?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-black uppercase mb-2">📱 Смартфон</p>
            <p className="opacity-70">Настройки → Об устройстве → Серийный номер или в коробке на наклейке</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2">💻 Ноутбук</p>
            <p className="opacity-70">Снизу корпуса на наклейке или в системной информации</p>
          </div>
          <div>
            <p className="font-black uppercase mb-2">📦 Коробка</p>
            <p className="opacity-70">На боковой или задней стороне упаковки товара</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;