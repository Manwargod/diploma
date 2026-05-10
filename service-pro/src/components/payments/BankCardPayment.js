import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';

const BankCardPayment = ({ isDark, amount, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  // Форматирование срока действия (MM/YY)
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  // Валидация
  const validateForm = () => {
    const newErrors = {};

    // Проверка номера карты (должен быть 16 цифр)
    const cardNumber = cardData.number.replace(/\s+/g, '');
    if (cardNumber.length !== 16) {
      newErrors.number = 'Номер карты должен содержать 16 цифр';
    }

    // Проверка имени держателя
    if (!cardData.holder.trim()) {
      newErrors.holder = 'Укажите имя держателя карты';
    }

    // Проверка срока действия
    if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Укажите срок в формате MM/YY';
    } else {
      const [month, year] = cardData.expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const cardMonth = parseInt(month);
      const cardYear = parseInt(year);

      if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
        newErrors.expiry = 'Срок действия карты истёк';
      }
    }

    // Проверка CVV
    if (!cardData.cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'CVV должен содержать 3 цифры';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка платежа
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Случайно 95% успехов, 5% ошибок для реалистичности
      const success = Math.random() > 0.05;

      if (success) {
        // Успешный платёж
        onPaymentSuccess({
          method: 'bank_card',
          amount,
          cardLastFour: cardData.number.slice(-4),
          timestamp: new Date().toISOString(),
          transactionId: `CARD-${Date.now()}`
        });
      } else {
        // Ошибка платежа
        throw new Error('Недостаточно средств на счёте');
      }
    } catch (error) {
      setIsProcessing(false);
      onPaymentError(error.message || 'Ошибка при обработке платежа');
    }
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 3);
    } else if (field === 'holder') {
      formattedValue = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '').slice(0, 26);
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Очистить ошибку для этого поля при редактировании
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Определение типа карты по номеру
  const getCardType = (number) => {
    const cardNumber = number.replace(/\s+/g, '');
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const cardType = getCardType(cardData.number);

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      isDark ? 'border-purple-500/30 bg-purple-500/5' : 'border-purple-500/20 bg-purple-500/5'
    }`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-black">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-black text-lg">Платёж банковской картой</h3>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              Безопасно и быстро
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Сумма к оплате: <span className="font-black text-purple-500">{amount.toLocaleString('ru-RU')} ₸</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Номер карты
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              placeholder="0000 0000 0000 0000"
              maxLength="19"
              className={`w-full px-4 py-3 rounded-lg font-mono transition-all ${
                isDark
                  ? 'bg-[#0f0f12] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  : 'bg-white border border-black/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
              } outline-none`}
            />
            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            {cardData.number && (
              <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Тип карты: {cardType}
              </p>
            )}
          </div>

          {/* Holder Name */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Имя держателя
            </label>
            <input
              type="text"
              value={cardData.holder}
              onChange={(e) => handleInputChange('holder', e.target.value)}
              placeholder="JOHN DOE"
              className={`w-full px-4 py-3 rounded-lg font-semibold uppercase transition-all ${
                isDark
                  ? 'bg-[#0f0f12] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  : 'bg-white border border-black/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
              } outline-none`}
            />
            {errors.holder && <p className="text-red-500 text-xs mt-1">{errors.holder}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                Срок действия
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                placeholder="MM/YY"
                maxLength="5"
                className={`w-full px-4 py-3 rounded-lg font-mono transition-all ${
                  isDark
                    ? 'bg-[#0f0f12] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                    : 'bg-white border border-black/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                } outline-none`}
              />
              {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                CVV/CVC
              </label>
              <input
                type="password"
                value={cardData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="000"
                maxLength="3"
                className={`w-full px-4 py-3 rounded-lg font-mono transition-all ${
                  isDark
                    ? 'bg-[#0f0f12] border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                    : 'bg-white border border-black/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                } outline-none`}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
              isProcessing
                ? `${isDark ? 'bg-white/10' : 'bg-black/10'} opacity-50 cursor-not-allowed`
                : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:scale-105'
            }`}
          >
            <Lock size={20} />
            {isProcessing ? 'Обрабатываем платёж...' : 'Оплатить'}
          </button>
        </form>

        {/* Security Badge */}
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-500/5 border border-green-500/20'
        }`}>
          <Lock size={16} className="text-green-500 flex-shrink-0" />
          <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            Все платежи зашифрованы и обработаны с использованием PCI DSS стандартов
          </p>
        </div>

        {/* Info */}
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
          Тестовые номера карт: 4111 1111 1111 1111 (Visa), 5555 5555 5555 4444 (Mastercard)
        </p>
      </div>
    </div>
  );
};

export default BankCardPayment;
