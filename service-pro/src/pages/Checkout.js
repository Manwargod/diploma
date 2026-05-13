import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import KaspiQRPayment from '../components/payments/KaspiQRPayment';
import HalykQRPayment from '../components/payments/HalykQRPayment';
import BankCardPayment from '../components/payments/BankCardPayment';
import ServiceCenterModal from '../components/ServiceCenterModal';
import LoginModal from '../components/LoginModal';
import { processPayment, saveOrderWithPayment } from '../utils/PaymentHandler';
import { createOrder } from '../utils/orderService';
import { formatPrice } from '../utils/format';
import serviceCenters from '../data/serviceCenters';
import profileService from '../utils/profileService';
import ConsentGate from '../components/ConsentGate';
import { getDeliveryEstimate } from '../utils/deliveryEstimate';

const Checkout = ({ isDark }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
  const [serviceCenterOpen, setServiceCenterOpen] = useState(false);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState(location.state?.preselectedCenterId || '');
  const [loginOpen, setLoginOpen] = useState(false);
  const [deliveryConsent, setDeliveryConsent] = useState(false);
  const [paymentConsent, setPaymentConsent] = useState(false);

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

  useEffect(() => {
    if (location.state?.preselectedCenterId) {
      setSelectedServiceCenter(location.state.preselectedCenterId);
    }
  }, [location.state]);

  // Валидация данных доставки
  const validateDeliveryData = () => {
    if (!deliveryData.fullName.trim()) {
      setOrderError(t('validation.required'));
      return false;
    }
    if (!deliveryData.phone.match(/^\+?[1-9]\d{9,14}$/)) {
      setOrderError(t('validation.phone'));
      return false;
    }
    if (!deliveryData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setOrderError(t('validation.email'));
      return false;
    }
    if (!deliveryData.address.trim() && deliveryData.deliveryMethod === 'courier') {
      setOrderError(t('validation.required'));
      return false;
    }
    return true;
  };

  const deliveryEstimate = deliveryData.deliveryMethod === 'courier'
    ? getDeliveryEstimate({ placedAt: new Date(), locale: i18n.language || 'en' })
    : null;

  // Обработка платежа
  const handlePaymentSuccess = async (paymentData) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (!selectedServiceCenter) {
      setOrderError(t('validation.required'));
      setServiceCenterOpen(true);
      return;
    }
    setIsProcessing(true);
    setOrderError('');

    try {
      profileService.mergeProfileFromSubmission(user?.id, {
        name: deliveryData.fullName,
        phone: deliveryData.phone,
        address: deliveryData.deliveryMethod === 'courier' ? deliveryData.address : deliveryData.city
      });
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
        delivery: deliveryData,
        serviceCenterId: selectedServiceCenter,
        serviceCenter: serviceCenters.find((center) => center.id === selectedServiceCenter) || null,
        clientId: user?.id || 'guest'
      });

      const savedOrder = await createOrder(orderResult);
      setSuccessData(savedOrder);
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
            {t('product.backToMarket')}
          </button>
          <div className="text-center py-20">
            <h1 className="text-4xl font-black mb-4">{t('checkout.emptyCart')}</h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              {t('market.addToCart')}
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
          <h1 className="text-4xl font-black mb-2">{t('checkout.title')}</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>
            {t('repair.step')} {Object.values(STEPS).indexOf(currentStep) + 1} {t('repair.of')} {Object.keys(STEPS).length}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-4 gap-2 mb-12">
          {[
            { key: STEPS.CART_REVIEW, label: t('checkout.cartReview'), icon: '1' },
            { key: STEPS.DELIVERY_INFO, label: t('checkout.deliveryInfo'), icon: '2' },
            { key: STEPS.PAYMENT, label: t('checkout.payment'), icon: '3' },
            { key: STEPS.SUCCESS, label: t('checkout.success'), icon: '4' }
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
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                <h2 className="text-2xl font-black mb-6">{t('checkout.cartReview')}</h2>
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
                          {t('checkout.quantity')}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{formatPrice(item.price)}</p>
                        <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                          {formatPrice((Number(item.price) || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      setLoginOpen(true);
                      return;
                    }
                    setCurrentStep(STEPS.DELIVERY_INFO);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                >
                  {t('checkout.deliveryInfo')}
                </button>
              </div>
            )}

            {/* Step 2: Delivery Info */}
            {currentStep === STEPS.DELIVERY_INFO && (
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                <h2 className="text-2xl font-black mb-6">{t('checkout.deliveryInfo')}</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      {t('repair.name')}
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
                        {t('repair.phone')}
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
                        {t('auth.email')}
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
                      {t('checkout.city')}
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
                      {t('checkout.serviceCenter')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setServiceCenterOpen(true)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all text-left ${
                        selectedServiceCenter
                          ? 'border-[#00f2ff] bg-[#00f2ff]/10'
                          : isDark
                          ? 'bg-[#0f0f12] border-white/10 hover:border-white/20'
                          : 'bg-white border-black/10 hover:border-black/20'
                      }`}
                    >
                      <p className="font-black">
                        {serviceCenters.find((center) => center.id === selectedServiceCenter)?.name || t('common.select')}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                        {serviceCenters.find((center) => center.id === selectedServiceCenter)?.address || t('validation.required')}
                      </p>
                    </button>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      {t('checkout.deliveryMethod')}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { value: 'pickup', label: t('checkout.pickup'), desc: 'Free' },
                        { value: 'courier', label: t('checkout.courier'), desc: '1000 ₸' }
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

                  {deliveryEstimate && (
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-white border-black/10 text-black/80'}`}>
                      <p className="text-xs font-black uppercase opacity-60 mb-1">{t('checkout.delivery')}</p>
                      <p className="font-black">
                        {deliveryEstimate.mode === 'today'
                          ? t('checkout.etaToday')
                          : deliveryEstimate.mode === 'tomorrow'
                          ? t('checkout.etaTomorrow')
                          : deliveryEstimate.label}
                      </p>
                    </div>
                  )}

                  {deliveryData.deliveryMethod === 'courier' && (
                    <div>
                      <label className={`block font-bold mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                        {t('checkout.address')}
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
                    {t('common.back')}
                  </button>
                  <button
                    onClick={() => {
                      setOrderError('');
                      if (!user) {
                        setLoginOpen(true);
                        return;
                      }
                      if (!selectedServiceCenter) {
                        setOrderError(t('validation.required'));
                        setServiceCenterOpen(true);
                        return;
                      }
                      if (!deliveryConsent) {
                        setOrderError(t('validation.privacyConsent'));
                        return;
                      }
                      if (validateDeliveryData()) {
                        setCurrentStep(STEPS.PAYMENT);
                      }
                    }}
                    disabled={!deliveryConsent}
                    className="flex-1 py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('checkout.payment')}
                  </button>
                </div>

                <div className="mt-4">
                  <ConsentGate
                    checked={deliveryConsent}
                    onChange={setDeliveryConsent}
                    text={t('checkout.consent')}
                    policyLabel={t('common.privacyPolicy')}
                    policyUrl={process.env.REACT_APP_PRIVACY_POLICY_URL}
                    isDark={isDark}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === STEPS.PAYMENT && (
              <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                <h2 className="text-2xl font-black mb-6">{t('checkout.payment')}</h2>

                <div className="space-y-6 mb-8">
                  {[
                    { value: 'kaspi_qr', label: 'Kaspi QR', desc: 'Kaspi App' },
                    { value: 'halyk_qr', label: 'Halyk QR', desc: 'Halyk Bank' },
                    { value: 'bank_card', label: 'Bank card', desc: 'Visa, Mastercard' }
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
                      consentChecked={paymentConsent}
                      onConsentChange={setPaymentConsent}
                    />
                  )}
                  {selectedPaymentMethod === 'halyk_qr' && (
                    <HalykQRPayment
                      isDark={isDark}
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      consentChecked={paymentConsent}
                      onConsentChange={setPaymentConsent}
                    />
                  )}
                  {selectedPaymentMethod === 'bank_card' && (
                    <BankCardPayment
                      isDark={isDark}
                      amount={total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      consentChecked={paymentConsent}
                      onConsentChange={setPaymentConsent}
                    />
                  )}
                </div>

                <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase opacity-60">{t('checkout.serviceCenter')}</p>
                      <p className="font-black mt-1">
                        {serviceCenters.find((center) => center.id === selectedServiceCenter)?.name || t('validation.required')}
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
                </div>

                {orderError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                    {orderError}
                  </div>
                )}

                {isProcessing && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center gap-2">
                    <Loader size={18} className="animate-spin" />
                    <span>{t('common.loading')}...</span>
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

                <h2 className="text-4xl font-black mb-2 text-emerald-500">{t('checkout.orderAccepted')}</h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  {t('checkout.success')}
                </p>

                <div className={`p-6 rounded-lg mb-8 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-white/50' : 'text-black/50'}`}>ID</p>
                  <p className="font-black text-xl">{successData.orderId}</p>
                  <p className={`text-xs mt-4 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    ETA: {new Date(successData.estimatedDelivery).toLocaleDateString('ru-RU')}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/market')}
                    className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
                  >
                    {t('checkout.continueShopping')}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className={`w-full py-3 rounded-xl font-black transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    {t('common.home')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className={`rounded-2xl border p-6 h-fit sticky top-4 ${
            isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
          }`}>
            <h3 className="font-black text-lg mb-6">Итоги</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>{t('checkout.subtotal')}:</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-white/70' : 'text-black/70'}>{t('checkout.tax')} (8%):</span>
                <span className="font-bold">{formatPrice(tax)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                  <span>Скидка ({promoCode}):</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              {deliveryData.deliveryMethod === 'courier' && (
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/70' : 'text-black/70'}>{t('checkout.delivery')}:</span>
                  <span className="font-bold">{formatPrice(1000)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-black text-lg mb-6">
              <span>{t('checkout.total')}:</span>
              <span className="text-primary">
                {formatPrice(total + (deliveryData.deliveryMethod === 'courier' ? 1000 : 0))}
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

      <ServiceCenterModal
        isOpen={serviceCenterOpen}
        onClose={() => setServiceCenterOpen(false)}
        onConfirm={(centerId) => {
          setSelectedServiceCenter(centerId);
          setOrderError('');
          setServiceCenterOpen(false);
        }}
        centers={serviceCenters.filter((center) => center.city === 'Astana')}
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

export default Checkout;
