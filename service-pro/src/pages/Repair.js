import React, { useState } from 'react';
import { Smartphone, MapPin, MapPinCheck } from 'lucide-react';

const Repair = ({ t, isDark }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Нурсултан',
    phone: '',
    address: '',
    device: 'smartphone',
    issue: '',
    serviceCenter: 'almaty'
  });
  const [submitted, setSubmitted] = useState(false);

  const serviceCenters = [
    { id: 'almaty', name: 'ServicePro Almaty - Mega', address: 'ул. Розыбакиева 247' },
    { id: 'astana', name: 'ServicePro Astana - Keruen', address: 'ул. Достык 9' },
    { id: 'shymkent', name: 'ServicePro Shymkent - Plaza', address: 'пр. Аль-Фараби 3/1' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (step === 1) {
      if (formData.phone && formData.address) setStep(2);
    } else if (step === 2) {
      if (formData.issue) setStep(3);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
          <MapPinCheck size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Request Accepted!' : t?.buildBtn === 'ПК жинау' ? 'Өтінім қабылданды!' : 'Заявка принята!'}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{t?.buildBtn === 'Build PC' ? 'Thank you for contacting us. Our manager will get in touch with you within 30 minutes to clarify the details.' : t?.buildBtn === 'ПК жинау' ? 'Бізге хабарласқаныңыз үшін рахмет. Біздің менеджері деталдарды анықтау үшін 30 минут ішінде сізбен байланысады.' : 'Спасибо за обращение. Наш менеджер свяжется с вами в течение 30 минут для уточнения деталей.'}</p>
        <p className="text-lg font-black text-[#00f2ff]">{t?.buildBtn === 'Build PC' ? 'Request ID' : t?.buildBtn === 'ПК жинау' ? 'Өтінім ID' : 'ID заявки'}: SP-{Math.floor(Math.random() * 10000)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00f2ff] to-[#7000ff] rounded-2xl flex items-center justify-center">
            <Smartphone size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t?.buildBtn === 'Build PC' ? 'Repair Registration' : t?.buildBtn === 'ПК жинау' ? 'Жөндеу тіркелуі' : 'Оформление ремонта'}</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-black uppercase opacity-60">
          <span>{t?.buildBtn === 'Build PC' ? 'Step' : t?.buildBtn === 'ПК жинау' ? 'Қадам' : 'Шаг'} {step} {t?.buildBtn === 'Build PC' ? 'of 3' : t?.buildBtn === 'ПК жинау' ? '3-тен' : 'из 3'}</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff] transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      {/* Form */}
      <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0f0f12] border-white/5' : 'bg-white border-black/5'} space-y-6`}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Your Contacts' : t?.buildBtn === 'ПК жинау' ? 'Сіздің хабарлары' : 'Ваши контакты'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Name' : t?.buildBtn === 'ПК жинау' ? 'Есімі' : 'Имя'}</label>
                <input type="text" name="name" value={formData.name} readOnly className="w-full p-4 rounded-xl bg-white/5 border border-white/5 font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Phone' : t?.buildBtn === 'ПК жинау' ? 'Телефон' : 'Телефон'} *</label>
                <input type="tel" name="phone" placeholder="+7 (777) 123-45-67" value={formData.phone} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Address for Pickup' : t?.buildBtn === 'ПК жинау' ? 'Үндету үшін адресі' : 'Адрес для забора'} *</label>
              <input type="text" name="address" placeholder={t?.buildBtn === 'Build PC' ? 'Your address in the city...' : t?.buildBtn === 'ПК жинау' ? 'Шаұардағы сіздің адресі...' : 'Ваш адрес в городе...'} value={formData.address} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all" />
            </div>
          </div>
        )}

        {/* Step 2: Device & Issue */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Problem Description' : t?.buildBtn === 'ПК жинау' ? 'Масылұның сипаттамасы' : 'Описание проблемы'}</h3>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Device Type' : t?.buildBtn === 'ПК жинау' ? 'Құрылғының түрі' : 'Тип устройства'}</label>
              <select name="device" value={formData.device} onChange={handleInputChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all">
                <option value="smartphone">{t?.buildBtn === 'Build PC' ? 'Smartphone' : t?.buildBtn === 'ПК жинау' ? 'Мәтін телефон' : 'Смартфон'}</option>
                <option value="laptop">{t?.buildBtn === 'Build PC' ? 'Laptop' : t?.buildBtn === 'ПК жинау' ? 'Ноутбук' : 'Ноутбук'}</option>
                <option value="tablet">{t?.buildBtn === 'Build PC' ? 'Tablet' : t?.buildBtn === 'ПК жинау' ? 'Планшет' : 'Планшет'}</option>
                <option value="watch">{t?.buildBtn === 'Build PC' ? 'Smartwatch' : t?.buildBtn === 'ПК жинау' ? 'Акылы сааты' : 'Смарт-часы'}</option>
                <option value="other">{t?.buildBtn === 'Build PC' ? 'Other Device' : t?.buildBtn === 'ПК жинау' ? 'Осымдан ұстройство' : 'Другое устройство'}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'Problem Description' : t?.buildBtn === 'ПК жинау' ? 'Масылұның сипаттамасы' : 'Описание проблемы'} *</label>
              <textarea name="issue" placeholder={t?.buildBtn === 'Build PC' ? 'Describe the issue in detail...' : t?.buildBtn === 'ПК жинау' ? 'Масылы мөндіктеп сипаттаңыз...' : 'Подробно опишите, что с устройством...'} value={formData.issue} onChange={handleInputChange} rows="4" className="w-full p-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-[#00f2ff] font-bold transition-all resize-none" />
            </div>
          </div>
        )}

        {/* Step 3: Service Center */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase">{t?.buildBtn === 'Build PC' ? 'Select Service Center' : t?.buildBtn === 'ПК жинау' ? 'Сервис орталығы таңдаңыз' : 'Выберите сервис-центр'}</h3>
            <div className="grid gap-4">
              {serviceCenters.map(sc => (
                <label key={sc.id} className={`p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.serviceCenter === sc.id ? 'border-[#00f2ff] bg-[#00f2ff]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                  <input type="radio" name="serviceCenter" value={sc.id} checked={formData.serviceCenter === sc.id} onChange={handleInputChange} className="w-5 h-5 accent-[#00f2ff]" />
                  <div className="flex-grow">
                    <h4 className="font-black italic">{sc.name}</h4>
                    <p className="text-xs opacity-60 flex items-center gap-2">
                      <MapPin size={14} /> {sc.address}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-center">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-sm hover:border-white/30 transition-all">
            {t?.buildBtn === 'Build PC' ? 'Back' : t?.buildBtn === 'ПК жинау' ? 'Артықты' : 'Назад'}
          </button>
        )}
        <button onClick={handleSubmit} className="px-8 py-4 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white font-black rounded-xl uppercase text-sm hover:scale-105 transition-all">
          {step === 3 ? (t?.buildBtn === 'Build PC' ? 'Submit Request' : t?.buildBtn === 'ПК жинау' ? 'Өтінімді жіберу' : 'Отправить заявку') : (t?.buildBtn === 'Build PC' ? 'Next' : t?.buildBtn === 'ПК жинау' ? 'Олары қадамға' : 'Далее')}
        </button>
      </div>
    </div>
  );
};

export default Repair;