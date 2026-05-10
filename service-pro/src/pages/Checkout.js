import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import KaspiQRPayment from '../components/payments/KaspiQRPayment';
import HalykQRPayment from '../components/payments/HalykQRPayment';
import BankCardPayment from '../components/payments/BankCardPayment';
import { processPayment, saveOrderWithPayment } from '../utils/PaymentHandler';

const Checkout = ({ isDark, t }) => {
  const navigate = useNavigate();
  const { items, total, tax, subtotal, discount, promoCode, clearCart } = useCart();

  // Шаги оформления заказа
  const STEPS = {
    CART_REVIEW: 'cart_review',
    DELIVERY_INFO: 'delivery_info',
    PAYMENT: 'payment',
    SUCCESS: 'success'
  };

  const [currentStep, setCurrentStep] = useState(STEPS.CART_REVIEW);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('kaspi_qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Форма доставки
  const [deliveryData, setDeliveryData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Almaty',
    address: '',
    postalCode: '',
    deliveryMethod: 'pickup' // pickup | courier
  });

  // Данные успешного заказа
  const [successData, setSuccessData] = useState(null);

  // Валидация данных доставки
  const validateDeliveryData = () => {
    if (!deliveryData.fullName.trim()) {
      setOrderError('Укажите ФИО');
      return false;
    }
    if (!deliveryData.phone.match(/^\+?[0-9]{10,12}$/)) {
      setOrderError('Укажите корректный номер телефона');
      return false;
    }
    if (!deliveryData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setOrderError('Укажите корректный email');
      return false;
    }
    if (!deliveryData.address.trim() && deliveryData.deliveryMethod === 'courier') {
      setOrderError('Укажите адрес доставки');
      return false;
    }
    return true;
  };

  // Обработка платежа
  const handlePaymentSuccess = async (paymentData) => {
    setIsProcessing(true);
    setOrderError('');

    try {
      // Обработка платежа
      const paymentResult = await processPayment(paymentData, {
        items,
        total,
        deliveryData
      });

      // Сохранение заказа
      const orderResult = await saveOrderWithPayment({
        items,
        subtotal,
        tax,
        discount,
        promoCode,
        total,
        payment: paymentResult,
        delivery: deliveryData
      });

      setSuccessData(orderResult);
      setCurrentStep(STEPS.SUCCESS);
      clearCart();
    } catch (error) {
      setOrderError(error.message || 'Ошибка при обработке платежа');
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setOrderError(errorMessage);
    setIsProcessing(false);
  };

  // Если нет товаров - перенаправляем в магазин
  if (items.length === 0 && currentStep !== STEPS.SUCCESS) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#000000]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate('/market')}
            className="flex items-center gap-2 text-[#00f2ff] hover:opacity-70 transition-opacity mb-8"
          >
            <ArrowLeft size={20} />
            Вернуться в магазин
          </button>
          <div className="text-center py-20">
            <h1 className="text-4xl font-black mb-4">Корзина пуста</h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Добавьте товары перед оформлением заказа
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#000000]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(currentStep === STEPS.CART_REVIEW ? '/market' : -1)}
            className="flex items-center gap-2 text-[#00f2ff] hover:opacity-70 transition-opacity mb-6"
          >
            <ArrowLeft size={20} />
            {currentStep === STEPS.CART_REVIEW ? 'В магазин' : 'Назад'}
          </button>
          <h1 className="text-4xl font-black mb-2">Оформление заказа</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>
            Шаг {Object.values(STEPS).indexOf(currentStep) + 1} из {Object.keys(STEPS).length}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-4 gap-2 mb-12">
          {[
            { key: STEPS.CART_REVIEW, label: 'Корзина', icon: '1' },
            { key: STEPS.DELIVERY_INFO, label: 'Доставка', icon: '2' },
            { key: STEPS.PAYMENT, label: 'Оплата', icon: '3' },
            { key: STEPS.SUCCESS, label: 'Успех', icon: '✓' }
          ].map((step, index) => (
            <div
              key={step.key}
              className="flex items-center gap-2"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                step.key === currentStep
                  ? 'bg-[#00f2ff] text-black'
                  : Object.values(STEPS).indexOf(step.key) < Object.values(STEPS).indexOf(currentStep)
                  ? 'bg-emerald-500 text-white'
                  : isDark
                  ? 'bg-white/10 text-white/50'
                  : 'bg-black/10 text-black/50'
              }`}>
                {step.icon}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${
                step.key === currentStep
                  ? 'text-[#00f2ff]'
                  : isDark
                  ? 'text-white/50'
                  : 'text-black/50'
              }`}>
                {step.label}
              </span>
              {index < 3 && (
                <div className={`flex-1 h-0.5 mx-1 ${
                  Object.values(STEPS).indexOf(step.key) < Object.values(STEPS).indexOf(currentStep)
                    ? 'bg-emerald-500'
                    : isDark
                    ? 'bg-white/10'
                    : 'bg-black/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === STEPS.CART_REVIEW && (
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/2'}`}>
                <h2 className="text-2xl font-black mb-6">Проверка корзины</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-4 rounded-lg ${
                        isDark ? 'bg-[#0f0f12]' : 'bg-white'
                      }`}
                    >
                      <div>
                        <h3 className="font-black">{item.name}</h3>
                        <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#00f2ff]">{item.price}</p>
                        <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                          {(parseFloat(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString('ru-RU')} ₸
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(STEPS.DELIVERY_INFO)}
                  className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                >
                  Далее: Доставка
                </button>
              </div>
            )}

            {/* Step 2: Delivery Info */}
            {currentStep === STEPS.DELIVERY_INFO && (
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/2'}`}>
                <h2 className="text-2xl font-black mb-6">Данные доставки</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      ФИО
                    </label>
                    <input
                      type="text"
                      value={deliveryData.fullName}
                      onChange={(e) => setDeliveryData({ ...deliveryData, fullName: e.target.value })}
                      placeholder="Иван Иванов"
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? 'bg-[#0f0f12] border-white/10 focus:border-[#00f2ff]'
                          : 'bg-white border-black/10 focus:border-[#00f2ff]'
                      } outline-none`}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={deliveryData.phone}
                        onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                        placeholder="+77123456789"
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          isDark
                            ? 'bg-[#0f0f12] border-white/10 focus:border-[#00f2ff]'
                            : 'bg-white border-black/10 focus:border-[#00f2ff]'
                        } outline-none`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={deliveryData.email}
                        onChange={(e) => setDeliveryData({ ...deliveryData, email: e.target.value })}
                        placeholder="example@mail.com"
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          isDark
                            ? 'bg-[#0f0f12] border-white/10 focus:border-[#00f2ff]'
                            : 'bg-white border-black/10 focus:border-[#00f2ff]'
                        } outline-none`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      Город
                    </label>
                    <select
                      value={deliveryData.city}
                      onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all ${
                        isDark
                          ? 'bg-[#0f0f12] border-white/10 focus:border-[#00f2ff]'
                          : 'bg-white border-black/10 focus:border-[#00f2ff]'
                      } outline-none`}
                    >
                      <option>Almaty</option>
                      <option>Astana</option>
                      <option>Shymkent</option>
                      <option>Aktau</option>
                      <option>Karaganda</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      Тип доставки
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { value: 'pickup', label: 'Самовывоз', desc: 'Бесплатно' },
                        { value: 'courier', label: 'Курьер', desc: '1000 ₸' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setDeliveryData({ ...deliveryData, deliveryMethod: option.value })}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            deliveryData.deliveryMethod === option.value
                              ? 'border-[#00f2ff] bg-[#00f2ff]/10'
                              : isDark
                              ? 'border-white/10 hover:border-white/20'
                              : 'border-black/10 hover:border-black/20'
                          }`}
                        >
                          <p className="font-black">{option.label}</p>
                          <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>{option.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {deliveryData.deliveryMethod === 'courier' && (
                    <div>
                      <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                        Адрес доставки
                      </label>
                      <input
                        type="text"
                        value={deliveryData.address}
                        onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                        placeholder="ул. Абая, д. 123, кв. 45"
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          isDark
                            ? 'bg-[#0f0f12] border-white/10 focus:border-[#00f2ff]'
                            : 'bg-white border-black/10 focus:border-[#00f2ff]'
                        } outline-none`}
                      />
                    </div>
                  )}
                </div>

                {orderError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm mb-4">
                    {orderError}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(STEPS.CART_REVIEW)}
                    className={`flex-1 py-3 rounded-xl font-black transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => {
                      setOrderError('');
                      if (validateDeliveryData()) {
                        setCurrentStep(STEPS.PAYMENT);
                      }
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                  >
                    Далее: Оплата
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === STEPS.PAYMENT && (
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/2'}`}>
                <h2 className="text-2xl font-black mb-6">Выберите способ оплаты</h2>

                <div className="space-y-6 mb-8">
                  {[
                    { value: 'kaspi_qr', label: 'Kaspi QR', desc: 'Быстрая оплата через Kaspi' },
                    { value: 'halyk_qr', label: 'Halyk QR', desc: 'Платёж через Halyk Bank' },
                    { value: 'bank_card', label: 'Банковская карта', desc: 'Visa, Mastercard' }
                  ].map(method => (
                    <button
                      key={method.value}
                      onClick={() => {
                        setSelectedPaymentMethod(method.value);
                        setOrderError('');
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPaymentMethod === method.value
                          ? 'border-[#00f2ff] bg-[#00f2ff]/10'
                          : isDark
                          ? 'border-white/10 hover:border-white/20'
                          : 'border-black/10 hover:border-black/20'
                      }`}
                    >
                      <p className="font-black">{method.label}</p>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>{method.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Payment Method Components */}
                <div className="mb-8">
                  {selectedPaymentMethod === 'kaspi_qr' && (
                    <KaspiQRPayment
                      isDark={isDark}
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                  {selectedPaymentMethod === 'halyk_qr' && (
                    <HalykQRPayment
                      isDark={isDark}
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                  {selectedPaymentMethod === 'bank_card' && (
                    <BankCardPayment
                      isDark={isDark}
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                </div>

                {orderError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                    {orderError}
                  </div>
                )}

                {isProcessing && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center gap-2">
                    <Loader size={18} className="animate-spin" />
                    <span>Обрабатываем платёж...</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === STEPS.SUCCESS && successData && (
              <div className={`rounded-2xl border p-8 text-center ${isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle size={48} className="text-white" />
                  </div>
                </div>

                <h2 className="text-4xl font-black mb-2 text-emerald-500">Заказ принят!</h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  Спасибо за покупку. Ваш заказ успешно создан.
                </p>

                <div className={`p-6 rounded-lg mb-8 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-white/50' : 'text-black/50'}`}>ID заказа</p>
                  <p className="font-black text-xl">{successData.orderId}</p>
                  <p className={`text-xs mt-4 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    Ожидаемая доставка: {new Date(successData.estimatedDelivery).toLocaleDateString('ru-RU')}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/market')}
                    className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                  >
                    Продолжить покупки
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className={`w-full py-3 rounded-xl font-black transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    На главную
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className={`rounded-2xl border p-6 h-fit sticky top-4 ${
            isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/2'
          }`}>
            <h3 className="font-black text-lg mb-6">Итоги</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>Подитого:</span>
                <span className="font-bold">{subtotal.toLocaleString('ru-RU')} ₸</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>Налог (8%):</span>
                <span className="font-bold">{tax.toLocaleString('ru-RU')} ₸</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                  <span>Скидка ({promoCode}):</span>
                  <span>-{discount.toLocaleString('ru-RU')} ₸</span>
                </div>
              )}

              {deliveryData.deliveryMethod === 'courier' && (
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/70' : 'text-black/70'}>Доставка:</span>
                  <span className="font-bold">1 000 ₸</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-black text-lg mb-6">
              <span>Итого:</span>
              <span className="text-[#00f2ff]">
                {(total + (deliveryData.deliveryMethod === 'courier' ? 1000 : 0)).toLocaleString('ru-RU')} ₸
              </span>
            </div>

            <div className={`p-4 rounded-lg text-xs ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/5 text-blue-600'}`}>
              <p className="font-bold mb-2">Информация о доставке</p>
              <ul className="space-y-1">
                <li>• Город: {deliveryData.city}</li>
                <li>• Тип: {deliveryData.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьер'}</li>
                {deliveryData.deliveryMethod === 'courier' && <li>• Адрес: {deliveryData.address || '(не указан)'}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
