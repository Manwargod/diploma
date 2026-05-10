import React, { useState } from 'react';
import { Cpu, Zap, Sparkles, Loader2, ShoppingCart } from 'lucide-react';
import PCVisualizer from '../components/PCVisualizer';

const Build = ({ t, isDark }) => {
  const [buildPurpose, setBuildPurpose] = useState('gaming');
  const [selectedPreset, setSelectedPreset] = useState('medium');
  const [customBudget, setCustomBudget] = useState('');
  const [buildAddress, setBuildAddress] = useState('');
  const [isBuildSubmitting, setIsBuildSubmitting] = useState(false);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');

  const presets = [
    { id: 'budget', titleRu: 'Бюджетная', titleEn: 'Budget', descRu: 'Киберспорт / Базовые задачи', descEn: 'Esports / Basic Tasks', price: 'от 250 000 ₸', icon: Cpu },
    { id: 'medium', titleRu: 'Оптимальная', titleEn: 'Optimal', descRu: 'Уверенный 2K гейминг', descEn: 'Confident 2K Gaming', price: 'от 550 000 ₸', icon: Zap },
    { id: 'high', titleRu: 'Ультимативная', titleEn: 'Ultimate', descRu: 'Максимальная производительность', descEn: 'Maximum Performance', price: 'от 1 200 000 ₸', icon: Sparkles },
  ];

  const serviceCenters = [
    { id: 1, name: 'ServiceTap Алматы - Центр', address: 'пр. Абая, 42, Алматы', phone: '+7 (727) 123-45-67' },
    { id: 2, name: 'ServiceTap Алматы - Север', address: 'ул. Розыбакиева, 247, Алматы', phone: '+7 (727) 234-56-78' },
    { id: 3, name: 'ServiceTap Алматы - Юго-Восток', address: 'ул. Жамбылская, 123, Алматы', phone: '+7 (727) 345-67-89' },
    { id: 4, name: 'ServiceTap Астана', address: 'пр. Кабанбай Батыра, 45, Астана', phone: '+7 (705) 456-78-90' },
    { id: 5, name: 'ServiceTap Караганда', address: 'пр. Мира, 78, Караганда', phone: '+7 (701) 567-89-01' },
    { id: 6, name: 'ServiceTap Шымкент', address: 'ул. Азаттык, 56, Шымкент', phone: '+7 (707) 678-90-12' },
  ];

  const components = {
    budget: {
      cpu: [{ name: 'Intel Core i5-13400', price: 35000 }, { name: 'AMD Ryzen 5 5500', price: 32000 }],
      gpu: [{ name: 'RTX 3060', price: 60000 }, { name: 'RTX 4060', price: 65000 }],
      motherboard: [{ name: 'B660 PRIME', price: 25000 }, { name: 'B550 AORUS', price: 28000 }],
      ram: [{ name: 'DDR4 16GB', price: 15000 }, { name: 'DDR4 32GB', price: 28000 }],
      storage: [{ name: 'SSD 512GB', price: 12000 }, { name: 'SSD 1TB', price: 18000 }],
      psu: [{ name: '650W 80+', price: 20000 }, { name: '750W 80+', price: 25000 }],
    },
    medium: {
      cpu: [{ name: 'Intel Core i7-13700K', price: 65000 }, { name: 'AMD Ryzen 7 5800X', price: 60000 }],
      gpu: [{ name: 'RTX 4070', price: 140000 }, { name: 'RTX 4070 Ti', price: 180000 }],
      motherboard: [{ name: 'Z790 PRO', price: 45000 }, { name: 'X870 ELITE', price: 50000 }],
      ram: [{ name: 'DDR4 32GB', price: 40000 }, { name: 'DDR5 32GB', price: 55000 }],
      storage: [{ name: 'SSD 1TB', price: 20000 }, { name: 'SSD 2TB', price: 35000 }],
      psu: [{ name: '850W 80+', price: 40000 }, { name: '1000W 80+', price: 50000 }],
    },
    high: {
      cpu: [{ name: 'Intel Core i9-14900K', price: 95000 }, { name: 'AMD Ryzen 9 7950X', price: 100000 }],
      gpu: [{ name: 'RTX 4090', price: 300000 }, { name: 'RTX 6000 ADA', price: 400000 }],
      motherboard: [{ name: 'Z890 APEX', price: 80000 }, { name: 'X870E EXTREME', price: 90000 }],
      ram: [{ name: 'DDR5 64GB', price: 120000 }, { name: 'DDR5 128GB', price: 220000 }],
      storage: [{ name: 'SSD 2TB NVMe', price: 50000 }, { name: 'SSD 4TB NVMe', price: 90000 }],
      psu: [{ name: '1200W 80+', price: 70000 }, { name: '1500W 80+', price: 90000 }],
    },
  };

  const [selectedComponents, setSelectedComponents] = useState({
    cpu: components.medium.cpu[0].name,
    gpu: components.medium.gpu[0].name,
    motherboard: components.medium.motherboard[0].name,
    ram: components.medium.ram[0].name,
    storage: components.medium.storage[0].name,
    psu: components.medium.psu[0].name,
  });

  const [budgetFilter, setBudgetFilter] = useState(null);

  const handleBuildSubmit = () => {
    if (!buildAddress) return;
    setIsBuildSubmitting(true);
    setTimeout(() => {
      setIsBuildSubmitting(false);
      setBuildSuccess(true);
    }, 1500);
  };

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    setBudgetFilter(null);
    const preset = components[presetId];
    setSelectedComponents({
      cpu: preset.cpu[0].name,
      gpu: preset.gpu[0].name,
      motherboard: preset.motherboard[0].name,
      ram: preset.ram[0].name,
      storage: preset.storage[0].name,
      psu: preset.psu[0].name,
    });
  };

  const handleBudgetFilter = () => {
    if (!customBudget) return;
    const budget = parseInt(customBudget);
    setBudgetFilter(budget);
  };

  const getFilteredComponents = (componentType) => {
    const components_list = components[selectedPreset][componentType];
    if (!budgetFilter) {
      return components_list;
    }
    return components_list.filter(comp => comp.price <= budgetFilter);
  };

  if (buildSuccess) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <ShoppingCart size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Order Accepted!' : t?.buildBtn === 'ПК жинау' ? 'Таңдау қабылданды!' : 'Заявка принята!'}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t?.buildBtn === 'Build PC' ? 'Thank you for your order. Our manager will contact you to agree on the components and assembly details.' : t?.buildBtn === 'ПК жинау' ? 'Таңдауыгын үчін рахмет тіледі. Біздің менеджері сізбен компоненттерге йоҗн еүлін осы масыларымен кылысына байланады.' : 'Спасибо за заказ. Наш менеджер свяжется с вами для согласования комплектующих и деталей сборки.'}</p>
          <p className="text-lg font-black text-[#00f2ff]">{t?.buildBtn === 'Build PC' ? 'Order ID' : t?.buildBtn === 'ПК жинау' ? 'Таңдау ID' : 'ID заказа'}: BUILD-{Math.floor(Math.random() * 100000)}</p>
        </div>

        <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
          <h3 className="text-2xl font-black italic uppercase mb-6">{t?.buildBtn === 'Build PC' ? 'Select Service Center for Warranty' : t?.buildBtn === 'ПК жинау' ? 'Кепілдік үшін сервис орталық таңдаңыз' : 'Выберите сервис центр для гарантии'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceCenters.map(center => (
              <div
                key={center.id}
                onClick={() => setSelectedServiceCenter(center.id)}
                className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${
                  selectedServiceCenter === center.id
                    ? 'border-[#00f2ff] bg-[#00f2ff]/5'
                    : 'border-white/5 bg-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selectedServiceCenter === center.id
                      ? 'border-[#00f2ff] bg-[#00f2ff]'
                      : 'border-white/30'
                  }`}>
                    {selectedServiceCenter === center.id && <div className="w-2 h-2 bg-black rounded-full"></div>}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-black uppercase italic text-lg">{center.name}</h4>
                    <p className="text-sm text-gray-400 mt-2">{center.address}</p>
                    <p className="text-sm text-[#00f2ff] font-black mt-1">{center.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={!selectedServiceCenter}
            className="w-full mt-8 py-5 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl uppercase italic shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t?.buildBtn === 'Build PC' ? 'Confirm Service Center Selection' : t?.buildBtn === 'ПК жинау' ? 'Сервис орталық таңдауын растамау' : 'Подтвердить выбор сервис центра'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">{t?.build === 'Build' ? 'PC Configurator' : t?.build === 'Құрастыру' ? 'ПК Конфигуратор' : 'Конфигуратор ПК'}</h2>
        <p className="text-gray-500">{t?.buildBtn === 'Build PC' ? 'Select a ready-made preset or specify your budget' : t?.buildBtn === 'ПК жинау' ? 'Дайын пресетті таңдаңыз немесе өз бюджетін көрсетіңіз' : 'Выберите готовый пресет или укажите свой бюджет'}</p>
      </div>

      {/* Purpose Toggle */}
      <div className="flex justify-center">
        <div className={`flex gap-4 p-3 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'}`}>
          {['gaming', 'work'].map(p => (
            <button
              key={p}
              onClick={() => setBuildPurpose(p)}
              className={`px-8 py-3 rounded-xl font-black uppercase text-sm transition-all ${
                buildPurpose === p
                  ? 'bg-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/20'
                  : 'hover:bg-white/5'
              }`}
            >
              {p === 'gaming' ? (t?.buildBtn === 'Build PC' ? '🎮 Gaming' : t?.buildBtn === 'ПК жинау' ? '🎮 Ойындар' : '🎮 Гейминг') : (t?.buildBtn === 'Build PC' ? '💼 Workstation' : t?.buildBtn === 'ПК жинау' ? '💼 Жұмыс станциясы' : '💼 Рабочая станция')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Left Column - Visualization and Presets */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visualization */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="font-black italic uppercase mb-6">Визуализация</h3>
            <div className="h-[45vh] mb-6 bg-black/20 rounded-2xl overflow-hidden relative border border-white/5 flex items-center justify-center">
              <PCVisualizer isDark={isDark} />
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                <div className="px-2 py-1 bg-[#00f2ff] text-black text-[8px] font-black rounded-full uppercase">RTX 4090</div>
                <div className="px-2 py-1 bg-white/10 text-[8px] font-black rounded-full uppercase">i9-14900K</div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="text-2xl font-black italic uppercase mb-6">{t?.builtConfigs || 'Готовые конфигурации'}</h3>
            <div className="grid gap-4">
              {presets.map(p => (
                <div
                  key={p.id}
                  onClick={() => handlePresetChange(p.id)}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${
                    selectedPreset === p.id
                      ? 'border-[#00f2ff] bg-[#00f2ff]/5 translate-x-2'
                      : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all ${
                        selectedPreset === p.id
                          ? 'bg-[#00f2ff] text-black'
                          : 'bg-white/10'
                      }`}
                    >
                      <p.icon size={28} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black uppercase italic tracking-tighter text-lg">{t?.buildBtn === 'Build PC' ? p.titleEn : t?.buildBtn === 'ПК жинау' ? p.titleRu : p.titleRu}</h4>
                      <p className="text-xs opacity-50 font-bold uppercase">{t?.buildBtn === 'Build PC' ? p.descEn : t?.buildBtn === 'ПК жинау' ? p.descRu : p.descRu}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#00f2ff] text-lg">{p.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Edit Configuration */}
        <div className={`lg:col-span-3 p-8 rounded-[2rem] border sticky top-32 h-fit ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'} space-y-6`}>
          <h3 className="font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Edit Configuration' : t?.buildBtn === 'ПК жинау' ? 'Конфигурацияны реттеу' : 'Редактировать конфигурацию'}</h3>
          
          {/* Components Selectors */}
          <div className="space-y-4">
            {/* CPU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Processor (CPU)' : t?.buildBtn === 'ПК жинау' ? 'Процессор (CPU)' : 'Процессор (CPU)'}</label>
              <select
                value={selectedComponents.cpu}
                onChange={(e) => setSelectedComponents({...selectedComponents, cpu: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('cpu').map(cpu => (
                  <option key={cpu.name} value={cpu.name}>{cpu.name} - {cpu.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* GPU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Video Card (GPU)' : t?.buildBtn === 'ПК жинау' ? 'Видеокарта (GPU)' : 'Видеокарта (GPU)'}</label>
              <select
                value={selectedComponents.gpu}
                onChange={(e) => setSelectedComponents({...selectedComponents, gpu: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('gpu').map(gpu => (
                  <option key={gpu.name} value={gpu.name}>{gpu.name} - {gpu.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* Motherboard */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Motherboard' : t?.buildBtn === 'ПК жинау' ? 'Материнская плата' : 'Материнская плата'}</label>
              <select
                value={selectedComponents.motherboard}
                onChange={(e) => setSelectedComponents({...selectedComponents, motherboard: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('motherboard').map(mb => (
                  <option key={mb.name} value={mb.name}>{mb.name} - {mb.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* RAM */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'RAM (Memory)' : t?.buildBtn === 'ПК жинау' ? 'Оперативная память (RAM)' : 'Оперативная память (RAM)'}</label>
              <select
                value={selectedComponents.ram}
                onChange={(e) => setSelectedComponents({...selectedComponents, ram: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('ram').map(ram => (
                  <option key={ram.name} value={ram.name}>{ram.name} - {ram.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Storage (SSD)' : t?.buildBtn === 'ПК жинау' ? 'Хранилище (SSD)' : 'Хранилище (SSD)'}</label>
              <select
                value={selectedComponents.storage}
                onChange={(e) => setSelectedComponents({...selectedComponents, storage: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('storage').map(storage => (
                  <option key={storage.name} value={storage.name}>{storage.name} - {storage.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* PSU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Power Supply (PSU)' : t?.buildBtn === 'ПК жинау' ? 'Блок питания (PSU)' : 'Блок питания (PSU)'}</label>
              <select
                value={selectedComponents.psu}
                onChange={(e) => setSelectedComponents({...selectedComponents, psu: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              >
                <option value="">Нет</option>
                {getFilteredComponents('psu').map(psu => (
                  <option key={psu.name} value={psu.name}>{psu.name} - {psu.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-white/10"></div>
          
          {/* Custom Budget */}
          <div className="space-y-4">
            <h4 className="font-black italic uppercase text-sm">{t?.buildBtn === 'Build PC' ? 'Or specify your budget' : t?.buildBtn === 'ПК жинау' ? 'Немесе өз бюджетіңізді көрсетіңіз' : 'Или укажите свой бюджет'}</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Например: 700 000"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="flex-grow p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              />
              <button onClick={handleBudgetFilter} className="px-3 py-3 bg-[#00f2ff] text-black font-black rounded-xl text-sm hover:scale-105 transition-all">₸</button>
            </div>
            <p className="text-xs opacity-50">{t?.buildBtn === 'Build PC' ? 'Click the ₸ button to filter components' : t?.buildBtn === 'ПК жинау' ? 'Компоненттерді сүзгілеу үшін ₸ түймесін басыңыз' : 'Нажмите кнопку ₸ для фильтрации комплектующих'}</p>
            {budgetFilter && <p className="text-xs text-[#00f2ff] font-black">{t?.buildBtn === 'Build PC' ? 'Filter: up to ' : t?.buildBtn === 'ПК жинау' ? 'Сүзгі: ' : 'Фильтр: до '}{budgetFilter.toLocaleString()} ₸</p>}
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Delivery Address' : t?.buildBtn === 'ПК жинау' ? 'Хселі адресі' : 'Адрес доставки'}</label>
              <input
                type="text"
                placeholder={t?.buildBtn === 'Build PC' ? 'Your address in Almaty...' : t?.buildBtn === 'ПК жинау' ? 'Алматы сеәлінде сіздің адресі...' : 'Ваш адрес в Алматы...'}
                value={buildAddress}
                onChange={(e) => setBuildAddress(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all"
              />
            </div>
            <button
              onClick={handleBuildSubmit}
              disabled={isBuildSubmitting || !buildAddress}
              className="w-full py-5 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl uppercase italic shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBuildSubmitting ? (
                <><Loader2 className="animate-spin" size={18} /> {t?.buildBtn === 'Build PC' ? 'Sending...' : t?.buildBtn === 'ПК жинау' ? 'Жіберілу...' : 'Отвравка...'}</>
              ) : (
                <><ShoppingCart size={18} /> {t?.buildBtn === 'Build PC' ? 'Order Assembly' : t?.buildBtn === 'ПК жинау' ? 'Сборка таңдаысы' : 'Заказать сборку'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Build;