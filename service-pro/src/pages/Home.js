import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Smartphone, Cpu, Zap, Sparkles, Wrench, Settings as SettingsIcon } from 'lucide-react';
import ActionButton from '../components/ui/ActionButton';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-40 space-y-24">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 sp-hero-enter">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none sp-hero-title">
          {t('hero.title')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {t('hero.accent')}
          </span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto sp-hero-sub">{t('hero.subtitle')}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/repair">
            <ActionButton>{t('hero.ctaRepair')}</ActionButton>
          </Link>
          <Link to="/build">
            <ActionButton variant="ghost">{t('hero.ctaBuild')}</ActionButton>
          </Link>
        </div>
      </section>

      {/* Services Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Repair Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Wrench size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t('home.repairTitle')}</h2>
              <p className="text-muted text-sm">{t('home.repairSubtitle')}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <Smartphone size={24} className="text-primary mb-2" />
              <h4 className="font-bold uppercase text-sm">{t('home.smartphones')}</h4>
              <p className="text-xs text-muted">iPhone, Samsung, Huawei</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <SettingsIcon size={24} className="text-primary mb-2" />
              <h4 className="font-bold uppercase text-sm">{t('home.laptops')}</h4>
              <p className="text-xs text-muted">MacBook, Windows</p>
            </div>
          </div>
          <Link to="/repair" className="inline-block">
            <ActionButton>{t('home.submitRepair')}</ActionButton>
          </Link>
        </div>

        {/* Build Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
              <Cpu size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t('home.buildTitle')}</h2>
              <p className="text-muted text-sm">{t('home.buildSubtitle')}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <Zap size={24} className="text-secondary mb-2" />
              <h4 className="font-bold uppercase text-sm">{t('home.gaming')}</h4>
              <p className="text-xs text-muted">{t('build.purposeGaming')}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <Sparkles size={24} className="text-secondary mb-2" />
              <h4 className="font-bold uppercase text-sm">{t('home.workstations')}</h4>
              <p className="text-xs text-muted">{t('build.purposeWork')}</p>
            </div>
          </div>
          <Link to="/build" className="inline-block">
            <ActionButton>{t('home.buildNow')}</ActionButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;