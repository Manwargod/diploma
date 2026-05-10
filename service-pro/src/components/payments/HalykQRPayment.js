import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const HalykQRPayment = ({ isDark, amount, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Halyk Bank реквизиты
  const halykAccountNumber = '1234567890123456'; // IBAN номер счёта
  const halykBankCode = '010'; // SWIFT код Halyk Bank
  const halykMerchantId = 'halyk_service_market_kz';

  // Генерация QR кода для Halyk
  const generateQRCode = async () => {
    setIsProcessing(true);
    try {
      // Имитация запроса к Halyk API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Генерируем фальшивый QR код
      const qrCodeData = `halyk://pay/${halykMerchantId}?amount=${amount}&account=${halykAccountNumber}`;
      
      setShowQR(qrCodeData);
      console.log('Halyk QR Code data:', qrCodeData);
      
      // Имитируем успешный платёж через 4 секунды (Halyk медленнее обрабатывает)
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess({
          method: 'halyk_qr',
          amount,
          timestamp: new Date().toISOString(),
          transactionId: `HALYK-${Date.now()}`
        });
      }, 4000);
    } catch (error) {
      setIsProcessing(false);
      onPaymentError('Ошибка при генерации QR кода Halyk');
    }
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(halykAccountNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
    }`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black">
            H
          </div>
          <div>
            <h3 className="font-black text-lg">Halyk QR Code</h3>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              Платёж через приложение Halyk Bank
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Сумма к оплате: <span className="font-black text-emerald-500">{amount.toLocaleString('ru-RU')} ₸</span>
          </p>
        </div>

        {/* QR Code Display or Button */}
        {!showQR ? (
          <button
            onClick={generateQRCode}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-xl font-black transition-all ${
              isProcessing
                ? `${isDark ? 'bg-white/10' : 'bg-black/10'} opacity-50 cursor-not-allowed`
                : 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:scale-105'
            }`}
          >
            {isProcessing ? 'Генерируем QR код...' : 'Получить QR код'}
          </button>
        ) : (
          <>
            {/* QR Code Placeholder */}
            <div className={`p-6 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-white/5' : 'bg-black/5'
            }`}>
              <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <div className="text-white font-black text-center">
                  <div className="text-4xl mb-2">▀▀▀</div>
                  <p className="text-xs">Halyk QR</p>
                </div>
              </div>
            </div>

            <p className={`text-sm text-center ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Отсканируйте этот QR-код приложением Halyk для оплаты
            </p>

            {/* Payment Status */}
            <div className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600'
            }`}>
              <p className="text-sm font-bold">⏳ Ожидание оплаты (обработка до 1 минуты)...</p>
            </div>
          </>
        )}

        {/* Alternative: Copy Account Number */}
        <div className={`p-4 rounded-lg border ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <p className={`text-xs font-bold mb-2 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
            Или переведите вручную на счёт Halyk Bank:
          </p>
          <div className="flex items-center gap-2 mb-3">
            <code className={`flex-1 px-3 py-2 rounded font-mono text-sm ${
              isDark ? 'bg-[#0f0f12]' : 'bg-white'
            }`}>
              {halykAccountNumber}
            </code>
            <button
              onClick={handleCopyAccountNumber}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
              title="Скопировать"
            >
              {isCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
          <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
            Код банка (BIC): {halykBankCode}
          </p>
        </div>

        {/* Info Banner */}
        <div className={`p-4 rounded-lg border-l-4 border-emerald-500 ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        }`}>
          <p className={`text-xs ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Halyk Bank обрабатывает платежи в течение 1-2 часов в рабочие дни. Срочные платежи обрабатываются быстрее.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HalykQRPayment;
