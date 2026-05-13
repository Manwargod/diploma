import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { Copy, Check } from 'lucide-react';
import ConsentGate from '../ConsentGate';

const KaspiQRPayment = ({ isDark, amount, onPaymentSuccess, onPaymentError, consentChecked, onConsentChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState('');

  // Казахский стан для Kaspi: +7 (код банка + номер счёта)
  const kaspiPhoneNumber = '+77718901234'; // Пример номера Kaspi
  const kaspiMerchantId = 'service_market_kz'; // ID вашего магазина

  // Генерация QR кода (в реальности используется Kaspi API)
  // Здесь мы просто имитируем получение QR кода
  const generateQRCode = async () => {
    setIsProcessing(true);
    try {
      // Имитация запроса к Kaspi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Генерируем фальшивый QR код (в реальности это приходит от Kaspi)
      const qrCodeData = `kaspi://pay/${kaspiMerchantId}?amount=${amount}&currency=KZT`;
      const qrImageData = await QRCode.toDataURL(qrCodeData);
      setQrImage(qrImageData);
      setShowQR(qrCodeData);
      
      // Имитируем успешный платёж через 3 секунды
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess({
          method: 'kaspi_qr',
          amount,
          timestamp: new Date().toISOString(),
          transactionId: `KASPI-${Date.now()}`
        });
      }, 3000);
    } catch (error) {
      setIsProcessing(false);
      onPaymentError('Ошибка при генерации QR кода');
    }
  };

  const handleCopyPhoneNumber = () => {
    navigator.clipboard.writeText(kaspiPhoneNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      isDark ? 'border-[#00f2ff]/30 bg-[#00f2ff]/5' : 'border-[#00f2ff]/20 bg-[#00f2ff]/5'
    }`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center text-white font-black">
            K
          </div>
          <div>
            <h3 className="font-black text-lg">Kaspi QR Code</h3>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              Быстрая оплата через приложение Kaspi
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Сумма к оплате: <span className="font-black text-[#00f2ff]">{amount.toLocaleString('ru-RU')} ₸</span>
          </p>
        </div>

        <div className={`p-3 rounded-lg border ${isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-600'}`}>
          <p className="text-xs font-bold">{t('payments.sandboxNotice')}</p>
        </div>

        <ConsentGate
          checked={consentChecked}
          onChange={onConsentChange}
          text={t('checkout.consent')}
          policyLabel={t('common.privacyPolicy')}
          policyUrl={process.env.REACT_APP_PRIVACY_POLICY_URL}
          isDark={isDark}
        />

        {/* QR Code Display or Button */}
        {!showQR ? (
          <button
            onClick={generateQRCode}
            disabled={isProcessing || !consentChecked}
            className={`w-full py-3 px-4 rounded-xl font-black transition-all ${
              isProcessing
                ? `${isDark ? 'bg-white/10' : 'bg-black/10'} opacity-50 cursor-not-allowed`
                : !consentChecked
                ? `${isDark ? 'bg-white/10' : 'bg-black/10'} text-white/40 cursor-not-allowed`
                : 'bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-white hover:scale-105'
            }`}
          >
            {isProcessing ? t('common.loading') : 'Получить QR код'}
          </button>
        ) : (
          <>
            {/* QR Code Placeholder */}
            <div className={`p-6 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-white/5' : 'bg-black/5'
            }`}>
              {qrImage && <img src={qrImage} alt="Kaspi QR" className="w-48 h-48" />}
            </div>

            <p className={`text-sm text-center ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Отсканируйте этот QR-код приложением Kaspi для оплаты
            </p>

            {/* Payment Status */}
            <div className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
            }`}>
              <p className="text-sm font-bold">Ожидание оплаты...</p>
            </div>
          </>
        )}

        {/* Alternative: Copy Phone Number */}
        <div className={`p-4 rounded-lg border ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <p className={`text-xs font-bold mb-2 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
            Или переведите вручную на номер Kaspi:
          </p>
          <div className="flex items-center gap-2">
            <code className={`flex-1 px-3 py-2 rounded font-mono ${
              isDark ? 'bg-[#0f0f12]' : 'bg-white'
            }`}>
              {kaspiPhoneNumber}
            </code>
            <button
              onClick={handleCopyPhoneNumber}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
              title="Скопировать"
            >
              {isCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
          После отправки платежа на вашу оплату будет 15 минут. Платежи обрабатываются моментально.
        </p>
      </div>
    </div>
  );
};

export default KaspiQRPayment;
