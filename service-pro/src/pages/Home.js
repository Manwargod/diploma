import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Cpu, Zap, Sparkles, Wrench, Settings as SettingsIcon } from 'lucide-react';

const Home = ({ t }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-40 space-y-32">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
          {t.heroTitle.split(' ')[0]} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#7000ff]">
            {t.heroTitle.split(' ')[1]}
          </span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">{t.heroSub}</p>
        <div className="flex justify-center gap-4">
          <Link to="/repair" className="px-10 py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase italic">{t.startBtn}</Link>
          <Link to="/build" className="px-10 py-5 border border-white/10 font-black rounded-2xl uppercase italic">{t.buildBtn}</Link>
        </div>
      </div>

      {/* Services Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Repair Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-2xl flex items-center justify-center">
              <Wrench size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t?.startBtn === 'Start Repair' ? 'Repair' : t?.startBtn === 'Ремонтты бастау' ? 'Жөндеу' : 'Ремонт'}</h2>
              <p className="text-gray-500 text-sm">{t?.startBtn === 'Start Repair' ? 'Professional equipment repair' : t?.startBtn === 'Ремонтты бастау' ? 'Кажеттік жөндеу қыжматы' : 'Профессиональный ремонт техники'}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed">
            Мы предлагаем полный спектр услуг по ремонту электроники: от диагностики до восстановления.
            Работаем с iPhone, MacBook, игровыми консолями и другой техникой.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <Smartphone size={24} className="text-[#00f2ff] mb-2" />
              <h4 className="font-bold uppercase text-sm">{t?.startBtn === 'Start Repair' ? 'Smartphones' : t?.startBtn === 'Ремонтты бастау' ? 'Мәтін телефондар' : 'Смартфоны'}</h4>
              <p className="text-xs opacity-70">{t?.startBtn === 'Start Repair' ? 'iPhone, Samsung, others' : t?.startBtn === 'Ремонтты бастау' ? 'iPhone, Samsung, өсі' : 'iPhone, Samsung, другие'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <SettingsIcon size={24} className="text-[#00f2ff] mb-2" />
              <h4 className="font-bold uppercase text-sm">{t?.startBtn === 'Start Repair' ? 'Laptops' : t?.startBtn === 'Ремонтты бастау' ? 'Ноутбуктар' : 'Ноутбуки'}</h4>
              <p className="text-xs opacity-70">{t?.startBtn === 'Start Repair' ? 'MacBook, Windows, repair' : t?.startBtn === 'Ремонтты бастау' ? 'MacBook, Windows, жөндеу' : 'MacBook, Windows, ремонт'}</p>
            </div>
          </div>
          <Link to="/repair" className="inline-block px-8 py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase italic hover:scale-105 transition-all">
            {t?.startBtn === 'Start Repair' ? 'Submit Repair' : t?.startBtn === 'Ремонтты бастау' ? 'Оформдеу жөндеу' : 'Оформить ремонт'}
          </Link>
        </div>

        {/* Build Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7000ff] to-[#00f2ff] rounded-2xl flex items-center justify-center">
              <Cpu size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t?.buildBtn === 'Build PC' ? 'PC Assembly' : t?.buildBtn === 'ПК жинау' ? 'ПК жинау' : 'Сборка ПК'}</h2>
              <p className="text-gray-500 text-sm">{t?.buildBtn === 'Build PC' ? 'Custom builds for your needs' : t?.buildBtn === 'ПК жинау' ? 'Сіздің қажеттіліктеріңіз үшін' : 'Кастомные сборки под ваши нужды'}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed">
            Соберем идеальный компьютер для ваших задач: от игровых станций до рабочих машин.
            Выбирайте готовые конфигурации или укажите бюджет для индивидуальной сборки.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <Zap size={24} className="text-[#7000ff] mb-2" />
              <h4 className="font-bold uppercase text-sm">{t?.buildBtn === 'Build PC' ? 'Gaming' : t?.buildBtn === 'ПК жинау' ? 'Ойын' : 'Гейминг'}</h4>
              <p className="text-xs opacity-70">{t?.buildBtn === 'Build PC' ? 'Maximum performance' : t?.buildBtn === 'ПК жинау' ? 'Ең тес ас эПО' : 'Максимальная производительность'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <Sparkles size={24} className="text-[#7000ff] mb-2" />
              <h4 className="font-bold uppercase text-sm">{t?.buildBtn === 'Build PC' ? 'Workstations' : t?.buildBtn === 'ПК жинау' ? 'Және жістікті' : 'Рабочие станции'}</h4>
              <p className="text-xs opacity-70">{t?.buildBtn === 'Build PC' ? 'For creativity and work' : t?.buildBtn === 'ПК жинау' ? 'Шығаршылық және жәмиске' : 'Для творчества и работы'}</p>
            </div>
          </div>
          <Link to="/build" className="inline-block px-8 py-4 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-2xl uppercase italic hover:scale-105 transition-all">
            {t?.buildBtn === 'Build PC' ? 'Build a PC' : t?.buildBtn === 'ПК жинау' ? 'ПК жинау' : 'Собрать ПК'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;