import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Zap, Sparkles, ShoppingCart, Gamepad2, Briefcase } from 'lucide-react';
import PCVisualizer from '../components/PCVisualizer';
import { estimatePerformance } from '../utils/performanceEngine';
import ActionButton from '../components/ui/ActionButton';
import serviceCenters from '../data/serviceCenters';
import { createBuild } from '../utils/buildService';
import { useAuth } from '../context/AuthContext';
import ServiceCenterModal from '../components/ServiceCenterModal';
import LoginModal from '../components/LoginModal';
import profileService from '../utils/profileService';

const PRESETS = {
  gaming: [
    { id: 'budget', title: 'Budget', desc: 'Esports / 1080p', price: 'от 250 000 ₸', icon: Cpu },
    { id: 'medium', title: 'Optimal', desc: '2K Gaming', price: 'от 550 000 ₸', icon: Zap },
    { id: 'high', title: 'Ultimate', desc: '4K Ultra', price: 'от 1 200 000 ₸', icon: Sparkles }
  ],
  work: [
    { id: 'budget', title: 'Studio', desc: 'Design / Office', price: 'от 300 000 ₸', icon: Cpu },
    { id: 'medium', title: 'Creator', desc: '3D / Editing', price: 'от 650 000 ₸', icon: Zap },
    { id: 'high', title: 'Render Pro', desc: 'Heavy Production', price: 'от 1 400 000 ₸', icon: Sparkles }
  ]
};

const READY_BUILDS = [
  {
    id: 'ready-gaming',
    title: 'Gaming Apex',
    purpose: 'gaming',
    preset: 'high',
    price: '1 250 000 ₸',
    summary: '4K ultra gaming, RTX 4090, i9'
  },
  {
    id: 'ready-work',
    title: 'Creator Studio',
    purpose: 'work',
    preset: 'medium',
    price: '720 000 ₸',
    summary: '3D & editing, RTX 4070 Ti, i7'
  }
];

const COMPONENTS_BY_PURPOSE = {
  gaming: {
    budget: {
      cpu: [{ name: 'Intel Core i5-13400', price: 35000 }, { name: 'AMD Ryzen 5 5500', price: 32000 }],
      gpu: [{ name: 'RTX 3060', price: 60000 }, { name: 'RTX 4060', price: 65000 }],
      motherboard: [{ name: 'B660 PRIME', price: 25000 }, { name: 'B550 AORUS', price: 28000 }],
      ram: [{ name: 'DDR4 16GB', price: 15000 }, { name: 'DDR4 32GB', price: 28000 }],
      storage: [{ name: 'SSD 512GB', price: 12000 }, { name: 'SSD 1TB', price: 18000 }],
      psu: [{ name: '650W 80+', price: 20000 }, { name: '750W 80+', price: 25000 }]
    },
    medium: {
      cpu: [{ name: 'Intel Core i7-13700K', price: 65000 }, { name: 'AMD Ryzen 7 5800X', price: 60000 }],
      gpu: [{ name: 'RTX 4070', price: 140000 }, { name: 'RTX 4070 Ti', price: 180000 }],
      motherboard: [{ name: 'Z790 PRO', price: 45000 }, { name: 'X870 ELITE', price: 50000 }],
      ram: [{ name: 'DDR4 32GB', price: 40000 }, { name: 'DDR5 32GB', price: 55000 }],
      storage: [{ name: 'SSD 1TB', price: 20000 }, { name: 'SSD 2TB', price: 35000 }],
      psu: [{ name: '850W 80+', price: 40000 }, { name: '1000W 80+', price: 50000 }]
    },
    high: {
      cpu: [{ name: 'Intel Core i9-14900K', price: 95000 }, { name: 'AMD Ryzen 9 7950X', price: 100000 }],
      gpu: [{ name: 'RTX 4090', price: 300000 }, { name: 'RTX 4080 Super', price: 240000 }],
      motherboard: [{ name: 'Z890 APEX', price: 80000 }, { name: 'X870E EXTREME', price: 90000 }],
      ram: [{ name: 'DDR5 64GB', price: 120000 }, { name: 'DDR5 128GB', price: 220000 }],
      storage: [{ name: 'SSD 2TB NVMe', price: 50000 }, { name: 'SSD 4TB NVMe', price: 90000 }],
      psu: [{ name: '1200W 80+', price: 70000 }, { name: '1500W 80+', price: 90000 }]
    }
  },
  work: {
    budget: {
      cpu: [{ name: 'Intel Core i5-13400', price: 35000 }, { name: 'AMD Ryzen 5 5500', price: 32000 }],
      gpu: [{ name: 'RTX 4060', price: 65000 }, { name: 'RTX 4070 Super', price: 175000 }],
      motherboard: [{ name: 'B660 PRIME', price: 25000 }, { name: 'B550 AORUS', price: 28000 }],
      ram: [{ name: 'DDR4 32GB', price: 28000 }, { name: 'DDR5 32GB', price: 55000 }],
      storage: [{ name: 'SSD 1TB', price: 18000 }, { name: 'SSD 2TB', price: 35000 }],
      psu: [{ name: '750W 80+', price: 25000 }, { name: '850W 80+', price: 40000 }]
    },
    medium: {
      cpu: [{ name: 'Intel Core i7-14700K', price: 70000 }, { name: 'AMD Ryzen 7 7700X', price: 68000 }],
      gpu: [{ name: 'RTX 4070 Ti', price: 180000 }, { name: 'RTX 4080 Super', price: 240000 }],
      motherboard: [{ name: 'Z790 PRO', price: 45000 }, { name: 'X870 ELITE', price: 50000 }],
      ram: [{ name: 'DDR5 64GB', price: 120000 }, { name: 'DDR5 32GB', price: 55000 }],
      storage: [{ name: 'SSD 2TB NVMe', price: 50000 }, { name: 'SSD 4TB NVMe', price: 90000 }],
      psu: [{ name: '1000W 80+', price: 50000 }, { name: '1200W 80+', price: 70000 }]
    },
    high: {
      cpu: [{ name: 'Intel Core i9-14900K', price: 95000 }, { name: 'AMD Ryzen 9 7950X', price: 100000 }],
      gpu: [{ name: 'RTX 6000 ADA', price: 400000 }, { name: 'RTX 4090', price: 300000 }],
      motherboard: [{ name: 'Z890 APEX', price: 80000 }, { name: 'X870E EXTREME', price: 90000 }],
      ram: [{ name: 'DDR5 128GB', price: 220000 }, { name: 'DDR5 64GB', price: 120000 }],
      storage: [{ name: 'SSD 4TB NVMe', price: 90000 }, { name: 'SSD 2TB NVMe', price: 50000 }],
      psu: [{ name: '1500W 80+', price: 90000 }, { name: '1200W 80+', price: 70000 }]
    }
  }
};

const Build = ({ isDark }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [buildPurpose, setBuildPurpose] = useState('gaming');
  const [selectedPreset, setSelectedPreset] = useState('medium');
  const [customBudget, setCustomBudget] = useState('');
  const [buildAddress, setBuildAddress] = useState('');
  const [isBuildSubmitting, setIsBuildSubmitting] = useState(false);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');
  const [serviceCenterOpen, setServiceCenterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [serviceCenterError, setServiceCenterError] = useState('');
  const [budgetFilter, setBudgetFilter] = useState(null);
  const [submittedBuild, setSubmittedBuild] = useState(null);
  const [hasCustomSelection, setHasCustomSelection] = useState(true);
  const [showPresetNotice, setShowPresetNotice] = useState(false);
  const [presetInitialized, setPresetInitialized] = useState(false);

  const [selectedComponents, setSelectedComponents] = useState({
    cpu: '',
    gpu: '',
    motherboard: '',
    ram: '',
    storage: '',
    psu: ''
  });

  useEffect(() => {
    if (!presetInitialized) {
      setPresetInitialized(true);
      return;
    }
    if (hasCustomSelection) {
      setShowPresetNotice(true);
      return;
    }
    const preset = COMPONENTS_BY_PURPOSE[buildPurpose][selectedPreset];
    setSelectedComponents({
      cpu: preset.cpu[0].name,
      gpu: preset.gpu[0].name,
      motherboard: preset.motherboard[0].name,
      ram: preset.ram[0].name,
      storage: preset.storage[0].name,
      psu: preset.psu[0].name
    });
  }, [buildPurpose, selectedPreset, hasCustomSelection, presetInitialized]);

  const performance = useMemo(() => estimatePerformance({
    cpu: selectedComponents.cpu,
    gpu: selectedComponents.gpu,
    ram: selectedComponents.ram
  }), [selectedComponents]);

  const selectedCenterDetails = serviceCenters.find((center) => center.id === selectedServiceCenter)
    || submittedBuild?.serviceCenter;

  const handleBuildSubmit = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (!buildAddress.trim()) return;
    if (!selectedServiceCenter) {
      setServiceCenterError(t('validation.required'));
      setServiceCenterOpen(true);
      return;
    }
    setIsBuildSubmitting(true);
    setTimeout(() => {
      const submit = async () => {
        try {
          profileService.mergeProfileFromSubmission(user?.id, {
            address: buildAddress,
            name: user?.name,
            phone: user?.phone
          });
          const serviceCenter = serviceCenters.find((center) => center.id === selectedServiceCenter);
          const buildEntry = await createBuild({
            id: `BUILD-${Date.now()}`,
            clientId: user?.id || 'guest',
            purpose: buildPurpose,
            cpu: selectedComponents.cpu,
            gpu: selectedComponents.gpu,
            status: 'pending',
            serviceCenterId: selectedServiceCenter,
            serviceCenter
          });
          setSubmittedBuild(buildEntry);
          setBuildSuccess(true);
        } finally {
          setIsBuildSubmitting(false);
        }
      };
      submit();
    }, 1200);
  };

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    setBudgetFilter(null);
  };

  const applyPreset = () => {
    const preset = COMPONENTS_BY_PURPOSE[buildPurpose][selectedPreset];
    setSelectedComponents({
      cpu: preset.cpu[0].name,
      gpu: preset.gpu[0].name,
      motherboard: preset.motherboard[0].name,
      ram: preset.ram[0].name,
      storage: preset.storage[0].name,
      psu: preset.psu[0].name
    });
    setHasCustomSelection(false);
    setShowPresetNotice(false);
  };

  const handleReadyBuild = (build) => {
    setBuildPurpose(build.purpose);
    setSelectedPreset(build.preset);
    setHasCustomSelection(false);
    setShowPresetNotice(false);
    const preset = COMPONENTS_BY_PURPOSE[build.purpose][build.preset];
    setSelectedComponents({
      cpu: preset.cpu[0].name,
      gpu: preset.gpu[0].name,
      motherboard: preset.motherboard[0].name,
      ram: preset.ram[0].name,
      storage: preset.storage[0].name,
      psu: preset.psu[0].name
    });
  };

  const handleComponentChange = (key, value) => {
    setSelectedComponents({ ...selectedComponents, [key]: value });
    if (!hasCustomSelection) setHasCustomSelection(true);
  };

  const handleBudgetFilter = () => {
    if (!customBudget) return;
    const sanitized = customBudget.replace(/\D/g, '').slice(0, 10);
    const budget = parseInt(sanitized || '0', 10);
    if (budget > 0) setBudgetFilter(budget);
  };

  const getFilteredComponents = (componentType) => {
    const components = COMPONENTS_BY_PURPOSE[buildPurpose][selectedPreset][componentType];
    if (!budgetFilter) return components;
    return components.filter(comp => comp.price <= budgetFilter);
  };

  if (buildSuccess) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
            <ShoppingCart size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black italic uppercase">{t('build.orderAccepted')}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('build.successMessage')}</p>
          <p className="text-lg font-black text-primary">{t('build.orderId')}: {submittedBuild?.id || '—'}</p>
        </div>

        <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
          <h3 className="text-2xl font-black italic uppercase mb-6">{t('checkout.serviceCenter')}</h3>
          {selectedCenterDetails ? (
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <h4 className="font-black uppercase italic text-lg">{selectedCenterDetails.name}</h4>
              <p className={`text-sm mt-2 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{selectedCenterDetails.address}</p>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-black/10 text-black/60'}`}>
              {t('validation.required')}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">{t('build.title')}</h2>
        <p className="text-gray-500">{t('build.subtitle')}</p>
      </div>

      {/* Purpose Toggle */}
      <div className="flex justify-center">
        <div className={`flex gap-4 p-3 rounded-2xl border ${isDark ? 'bg-[#0f0f12] border-white/10' : 'bg-white border-black/10'}`}>
          {[{ id: 'gaming', icon: Gamepad2, label: t('build.purposeGaming') }, { id: 'work', icon: Briefcase, label: t('build.purposeWork') }].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setBuildPurpose(id)}
              className={`px-8 py-3 rounded-xl font-black uppercase text-sm transition-all flex items-center gap-2 ${
                buildPurpose === id
                  ? 'bg-primary text-black shadow-lg shadow-primary/20'
                  : 'hover:bg-white/5'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
        {/* Left Column - Visualization and Presets */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="text-2xl font-black italic uppercase mb-6">{t('build.readyBuilds')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {READY_BUILDS.map((build) => (
                <button
                  key={build.id}
                  onClick={() => handleReadyBuild(build)}
                  className={`text-left p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-[#00f2ff]/40' : 'bg-black/5 border-black/10 hover:border-[#00f2ff]/40'}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black uppercase italic text-lg">{build.title}</h4>
                    <span className="text-xs font-black text-primary">{build.price}</span>
                  </div>
                  <p className="text-xs text-muted mt-2">{build.summary}</p>
                </button>
              ))}
            </div>
          </div>
          {/* Visualization */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="font-black italic uppercase mb-6">{t('build.visualization')}</h3>
            <div className={`h-[45vh] mb-6 rounded-2xl overflow-hidden relative border flex items-center justify-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-black/5 border-black/10'}`}>
              <PCVisualizer isDark={isDark} />
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                <div className="px-2 py-1 bg-primary text-black text-[8px] font-black rounded-full uppercase">{selectedComponents.gpu}</div>
                <div className="px-2 py-1 bg-white/10 text-[8px] font-black rounded-full uppercase">{selectedComponents.cpu}</div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="text-2xl font-black italic uppercase mb-6">{t('build.presets')}</h3>
            <div className="grid gap-4">
              {PRESETS[buildPurpose].map(p => (
                <div
                  key={p.id}
                  onClick={() => handlePresetChange(p.id)}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${
                    selectedPreset === p.id
                      ? 'border-primary bg-primary/5 translate-x-2'
                      : isDark
                      ? 'border-white/5 bg-white/5 hover:border-white/10'
                      : 'border-black/10 bg-black/5 hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all ${
                        selectedPreset === p.id
                          ? 'bg-primary text-black'
                          : 'bg-white/10'
                      }`}
                    >
                      <p.icon size={28} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black uppercase italic tracking-tighter text-lg">{p.title}</h4>
                      <p className="text-xs opacity-50 font-bold uppercase">{p.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-lg">{p.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="text-2xl font-black italic uppercase mb-4">{t('build.performance')}</h3>
            <p className="text-xs text-muted mb-6">{t('build.formulaHint')}: {performance.baseScore}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-black uppercase text-sm">{t('build.fpsTitle')}</h4>
                {performance.fps.map((game) => (
                  <div key={game.id} className="flex justify-between text-sm text-muted">
                    <span>{game.name}</span>
                    <span>{game.fps1080} FPS (1080p) • {game.fps1440} FPS (1440p)</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-black uppercase text-sm">{t('build.benchmarkTitle')}</h4>
                {performance.benchmarks.map((bench) => (
                  <div key={bench.id} className="flex justify-between text-sm text-muted">
                    <span>{bench.name}</span>
                    <span>{bench.time} мин</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Configuration */}
        <div className={`lg:col-span-3 p-8 rounded-[2rem] border sticky top-32 h-fit ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5 shadow-xl'} space-y-6`}>
          <h3 className="font-black italic uppercase">{t('build.editConfig')}</h3>

          {showPresetNotice && (
            <div className={`p-3 rounded-xl border ${isDark ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-amber-400/40 bg-amber-100 text-amber-800'}`}>
              <p className="text-xs font-bold">{t('build.presetNotice')}</p>
              <button
                onClick={applyPreset}
                className="mt-2 px-3 py-1 rounded-lg bg-primary text-black text-xs font-black uppercase"
              >
                {t('build.resetToPreset')}
              </button>
            </div>
          )}
          
          {/* Components Selectors */}
          <div className="space-y-4">
            {/* CPU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Processor (CPU)</label>
              <select
                value={selectedComponents.cpu}
                onChange={(e) => handleComponentChange('cpu', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">Нет</option>
                {getFilteredComponents('cpu').map(cpu => (
                  <option key={cpu.name} value={cpu.name}>{cpu.name} - {cpu.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* GPU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Video Card (GPU)</label>
              <select
                value={selectedComponents.gpu}
                onChange={(e) => handleComponentChange('gpu', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">Нет</option>
                {getFilteredComponents('gpu').map(gpu => (
                  <option key={gpu.name} value={gpu.name}>{gpu.name} - {gpu.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* Motherboard */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Motherboard</label>
              <select
                value={selectedComponents.motherboard}
                onChange={(e) => handleComponentChange('motherboard', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">Нет</option>
                {getFilteredComponents('motherboard').map(mb => (
                  <option key={mb.name} value={mb.name}>{mb.name} - {mb.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* RAM */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">RAM (Memory)</label>
              <select
                value={selectedComponents.ram}
                onChange={(e) => handleComponentChange('ram', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">Нет</option>
                {getFilteredComponents('ram').map(ram => (
                  <option key={ram.name} value={ram.name}>{ram.name} - {ram.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Storage (SSD)</label>
              <select
                value={selectedComponents.storage}
                onChange={(e) => handleComponentChange('storage', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
              >
                <option value="">Нет</option>
                {getFilteredComponents('storage').map(storage => (
                  <option key={storage.name} value={storage.name}>{storage.name} - {storage.price.toLocaleString()} ₸</option>
                ))}
              </select>
            </div>

            {/* PSU */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">Power Supply (PSU)</label>
              <select
                value={selectedComponents.psu}
                onChange={(e) => handleComponentChange('psu', e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:border-[#00f2ff] font-bold transition-all text-sm ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}
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
            <h4 className="font-black italic uppercase text-sm">{t('build.budgetFilter')}</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Например: 700 000"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-grow p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#00f2ff] font-bold transition-all text-sm"
              />
              <button onClick={handleBudgetFilter} className="px-3 py-3 bg-primary text-black font-black rounded-xl text-sm hover:scale-105 transition-all">₸</button>
            </div>
            <p className="text-xs opacity-60">{t('build.filterHint')}</p>
            {budgetFilter && <p className="text-xs text-primary font-black">{t('build.filterUpTo')} {budgetFilter.toLocaleString()} ₸</p>}
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase opacity-60">{t('checkout.serviceCenter')}</p>
                  <p className={`text-sm font-bold mt-1 ${selectedServiceCenter ? '' : 'opacity-50'}`}>
                    {selectedCenterDetails ? selectedCenterDetails.name : t('validation.required')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceCenterOpen(true)}
                  className="px-4 py-2 rounded-xl font-black uppercase text-xs bg-primary text-black"
                >
                  {t('common.select')}
                </button>
              </div>
              {serviceCenterError && <p className="text-xs text-red-400 mt-3">{serviceCenterError}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t('build.deliveryAddress')}</label>
              <input
                type="text"
                placeholder="Almaty, Abai 42"
                value={buildAddress}
                onChange={(e) => setBuildAddress(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all"
              />
            </div>
            <ActionButton
              onClick={handleBuildSubmit}
              disabled={isBuildSubmitting || !buildAddress}
              isLoading={isBuildSubmitting}
              className="w-full"
            >
              <ShoppingCart size={18} /> {t('build.orderAssembly')}
            </ActionButton>
          </div>
        </div>
      </div>
      <ServiceCenterModal
        isOpen={serviceCenterOpen}
        onClose={() => setServiceCenterOpen(false)}
        onConfirm={(centerId) => {
          setSelectedServiceCenter(centerId);
          setServiceCenterError('');
          setServiceCenterOpen(false);
        }}
        centers={serviceCenters}
        initialCenterId={selectedServiceCenter}
        isDark={isDark}
        title={t('checkout.serviceCenter')}
        confirmLabel={t('common.confirmSelection')}
        nearestLabel={t('common.nearestToYou')}
        selectLabel={t('common.select')}
        distanceLabel={t('common.kmAway')}
      />
        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          isDark={isDark}
          title={t('auth.signIn')}
        />
    </div>
  );
};

export default Build;