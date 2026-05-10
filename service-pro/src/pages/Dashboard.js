import React, { useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';

const Dashboard = ({ t, isDark }) => {
  const [approvalModal, setApprovalModal] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const orders = [
    {
      id: "SP-9921",
      name: "Ремонт iPhone 13 Pro",
      progress: 65,
      status: "Требует подтверждения",
      statusColor: "bg-amber-500",
      type: "repair",
      details: "Замена экрана, 45 000 ₸",
      date: "2024-01-15"
    },
    {
      id: "SP-8801",
      name: "Сборка Workstation",
      progress: 100,
      status: "Завершено",
      statusColor: "bg-emerald-500",
      type: "build",
      details: "i9-13900K, RTX 4080, 3M сек",
      date: "2024-01-10"
    }
  ];

  const bonusBalance = 5400;

  const handleApprove = (orderId) => {
    setApprovalModal(orderId);
    setSelectedOption(null);
  };

  const handlePayment = (option) => {
    setSelectedOption(option);
    // Simulate payment processing
    setTimeout(() => {
      setApprovalModal(null);
      alert(`Подтверждение: ${option.label} - ${option.price} ₸`);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">{t?.buildBtn === 'Build PC' ? 'My Cabinet' : t?.buildBtn === 'ПК жинау' ? 'Менің кабинетім' : 'Мой кабинет'}</h2>
        <div className={`flex items-center gap-3 text-2xl font-black ${isDark ? 'text-[#00f2ff]' : 'text-cyan-600'}`}>
          <Zap size={28} className="fill-current" />
          <span>{bonusBalance.toLocaleString('ru-RU')} {t?.buildBtn === 'Build PC' ? 'bonus' : t?.buildBtn === 'ПК жинау' ? 'бонус' : 'бонус'}</span>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black italic uppercase opacity-60">{t?.buildBtn === 'Build PC' ? 'My Requests' : t?.buildBtn === 'ПК жинау' ? 'Менің Өтінімдері' : 'Мои заявки'}</h3>

        {orders.map(order => (
          <div
            key={order.id}
            className={`p-8 rounded-[2.5rem] border transition-all ${
              isDark
                ? 'bg-[#0f0f12] border-white/5 hover:border-white/10'
                : 'bg-white border-black/5 shadow-lg'
            }`}
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm opacity-50 uppercase">{t?.buildBtn === 'Build PC' ? 'Request' : t?.buildBtn === 'ПК жинау' ? 'Өтінім' : 'Заявка'}</span>
                  <h4 className="text-2xl font-black italic uppercase">{order.id}</h4>
                  <span className={`px-4 py-2 rounded-full text-white text-xs font-black uppercase ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-lg font-bold">{order.name}</p>
                <p className="text-xs font-bold opacity-40 uppercase">{order.details}</p>
              </div>

              {order.status === "Требует подтверждения" && (
                <button
                  onClick={() => handleApprove(order.id)}
                  className="px-6 py-3 bg-[#00f2ff] text-black font-black rounded-xl hover:bg-[#00c2cc] transition-all flex items-center gap-2 whitespace-nowrap h-fit"
                >
                  {t?.buildBtn === 'Build PC' ? 'Confirm' : t?.buildBtn === 'ПК жинау' ? 'Растамау' : 'Подтвердить'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase opacity-50">{t?.buildBtn === 'Build PC' ? 'Completion Status' : t?.buildBtn === 'ПК жинау' ? 'Аюрталу статусы' : 'Статус выполнения'}</span>
                <span className="text-xl font-black text-[#00f2ff]">{order.progress}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <div
                  className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff] transition-all duration-500"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button className={`px-6 py-3 rounded-xl font-black uppercase text-sm transition-all ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-black/5 hover:bg-black/10'
              }`}>
                📋 {t?.buildBtn === 'Build PC' ? 'Track' : t?.buildBtn === 'ПК жинау' ? 'Тізеу' : 'Отследить'}
              </button>
              <button className={`px-6 py-3 rounded-xl font-black uppercase text-sm transition-all ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-black/5 hover:bg-black/10'
              }`}>
                ⓘ {t?.buildBtn === 'Build PC' ? 'More Details' : t?.buildBtn === 'ПК жинау' ? 'Көбіректі' : 'Подробнее'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      {approvalModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-[3rem] p-8 space-y-6 max-w-md w-full ${
            isDark ? 'bg-[#0a0a0c]' : 'bg-white'
          }`}>
            <div>
              <h3 className="text-2xl font-black italic uppercase mb-2">{t?.buildBtn === 'Build PC' ? 'Request Confirmation' : t?.buildBtn === 'ПК жинау' ? 'Өтінім растамауы' : 'Подтверждение заявки'}</h3>
              <p className="text-sm opacity-60 font-bold">{t?.buildBtn === 'Build PC' ? 'Select a payment option' : t?.buildBtn === 'ПК жинау' ? 'Өлем нәстерін таңдаңыз' : 'Выберите вариант оплаты'}</p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <div
                onClick={() => handlePayment({ label: "Диагностика", price: 5000 })}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedOption?.label === "Диагностика"
                    ? 'bg-[#00f2ff]/20 border-[#00f2ff]'
                    : `${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black">Диагностика</span>
                  <span className="text-[#00f2ff] font-black">5 000 ₸</span>
                </div>
                <p className="text-xs opacity-50 font-bold mt-1">Проверка и оценка</p>
              </div>

              <div
                onClick={() => handlePayment({ label: "Полный ремонт", price: 45000 })}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedOption?.label === "Полный ремонт"
                    ? 'bg-[#00f2ff]/20 border-[#00f2ff]'
                    : `${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black">Полный ремонт</span>
                  <span className="text-[#00f2ff] font-black">45 000 ₸</span>
                </div>
                <p className="text-xs opacity-50 font-bold mt-1">Замена + работы</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setApprovalModal(null)}
                className={`flex-1 px-4 py-3 rounded-xl font-black uppercase text-sm transition-all ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-black/5 hover:bg-black/10'
                }`}
              >
                {t?.buildBtn === 'Build PC' ? 'Cancel' : t?.buildBtn === 'ПК жинау' ? 'Болду' : 'Отменить'}
              </button>
              <button
                onClick={() => selectedOption && handlePayment(selectedOption)}
                disabled={!selectedOption}
                className="flex-1 px-4 py-3 rounded-xl bg-[#00f2ff] text-black font-black uppercase text-sm hover:bg-[#00c2cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t?.buildBtn === 'Build PC' ? 'Pay' : t?.buildBtn === 'ПК жинау' ? 'Олындау' : 'Оплатить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;