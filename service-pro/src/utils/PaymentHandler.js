/**
 * Payment Handler Mock
 * Имитирует обработку платежей для разных методов
 * В production заменить на реальный бэкенд API
 */

// Типы платежей
export const PAYMENT_METHODS = {
  KASPI_QR: 'kaspi_qr',
  HALYK_QR: 'halyk_qr',
  BANK_CARD: 'bank_card'
};

// Статусы платежей
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Обработка платежа
 * @param {Object} paymentData - Данные платежа
 * @param {string} paymentData.method - Метод платежа
 * @param {number} paymentData.amount - Сумма
 * @param {string} paymentData.transactionId - ID транзакции
 * @param {Object} orderData - Данные заказа
 * @returns {Promise<Object>} Результат обработки
 */
export const processPayment = async (paymentData, orderData) => {
  try {
    console.log('[PAYMENT] Processing payment:', paymentData);
    console.log('[ORDER] Order data:', orderData);

    // Имитация обработки на бэкенде
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Имитируем 90% успешных платежей
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          resolve({
            status: PAYMENT_STATUS.SUCCESS,
            transactionId: paymentData.transactionId,
            method: paymentData.method,
            amount: paymentData.amount,
            timestamp: new Date().toISOString(),
            orderId: `ORD-${Date.now()}`,
            message: 'Платёж успешно обработан'
          });
        } else {
          reject(new Error('Платёж отклонен банком'));
        }
      }, 1500);
    });

    return result;
  } catch (error) {
    console.error('[PAYMENT ERROR]', error);
    throw error;
  }
};

/**
 * Обработка платежа через Kaspi QR
 * @param {number} amount - Сумма платежа
 * @returns {Promise<Object>} QR-код и детали платежа
 */
export const generateKaspiQRCode = async (amount) => {
  try {
    console.log('[KASPI] Generating QR code for amount:', amount);

    // Имитация вызова Kaspi API
    const qrCode = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          qrCode: `kaspi://pay/service_market_kz?amount=${amount}&currency=KZT`,
          expiresIn: 900, // 15 минут
          merchantId: 'service_market_kz'
        });
      }, 1000);
    });

    return qrCode;
  } catch (error) {
    console.error('[KASPI ERROR]', error);
    throw error;
  }
};

/**
 * Обработка платежа через Halyk QR
 * @param {number} amount - Сумма платежа
 * @returns {Promise<Object>} QR-код и детали платежа
 */
export const generateHalykQRCode = async (amount) => {
  try {
    console.log('[HALYK] Generating QR code for amount:', amount);

    // Имитация вызова Halyk API
    const qrCode = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          qrCode: `halyk://pay/halyk_service_market_kz?amount=${amount}`,
          expiresIn: 1800, // 30 минут
          accountNumber: '1234567890123456',
          bankCode: '010'
        });
      }, 1200);
    });

    return qrCode;
  } catch (error) {
    console.error('[HALYK ERROR]', error);
    throw error;
  }
};

/**
 * Валидация банковской карты
 * @param {Object} cardData - Данные карты
 * @returns {Object} Объект с информацией о валидности
 */
export const validateCardData = (cardData) => {
  const errors = {};

  // Проверка номера карты (алгоритм Luhn)
  const cardNumber = cardData.number.replace(/\s+/g, '');
  if (!isValidCardNumber(cardNumber)) {
    errors.number = 'Невалидный номер карты';
  }

  // Проверка срока действия
  if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) {
    errors.expiry = 'Невалидный срок действия';
  }

  // Проверка CVV
  if (!cardData.cvv.match(/^\d{3,4}$/)) {
    errors.cvv = 'Невалидный CVV';
  }

  // Проверка имени
  if (!cardData.holder.trim()) {
    errors.holder = 'Укажите имя держателя';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Алгоритм Luhn для валидации номера карты
 * @param {string} cardNumber - Номер карты без пробелов
 * @returns {boolean} Валидна ли карта
 */
const isValidCardNumber = (cardNumber) => {
  if (!/^\d{13,19}$/.test(cardNumber)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Обработка возврата платежа (refund)
 * @param {string} transactionId - ID транзакции для возврата
 * @param {number} amount - Сумма возврата (по умолчанию вся сумма)
 * @returns {Promise<Object>} Результат возврата
 */
export const refundPayment = async (transactionId, amount) => {
  try {
    console.log('[REFUND] Processing refund for transaction:', transactionId);

    const refund = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'refund_processed',
          originalTransactionId: transactionId,
          refundId: `REF-${Date.now()}`,
          amount,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    });

    return refund;
  } catch (error) {
    console.error('[REFUND ERROR]', error);
    throw error;
  }
};

/**
 * Сохранение информации о заказе с платежом
 * @param {Object} orderData - Полная информация о заказе
 * @returns {Promise<Object>} Сохранённый заказ
 */
export const saveOrderWithPayment = async (orderData) => {
  try {
    console.log('[ORDER] Saving order to database:', orderData);

    // Имитация сохранения в БД
    const savedOrder = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `ORD-${Date.now()}`,
          ...orderData,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        });
      }, 800);
    });

    return savedOrder;
  } catch (error) {
    console.error('[ORDER ERROR]', error);
    throw error;
  }
};

/**
 * Получение статуса платежа по ID транзакции
 * @param {string} transactionId - ID транзакции
 * @returns {Promise<Object>} Статус платежа
 */
export const getPaymentStatus = async (transactionId) => {
  try {
    console.log('[STATUS] Fetching payment status for:', transactionId);

    const status = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId,
          status: PAYMENT_STATUS.SUCCESS,
          amount: 50000,
          method: PAYMENT_METHODS.KASPI_QR,
          createdAt: new Date(Date.now() - 60000).toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 500);
    });

    return status;
  } catch (error) {
    console.error('[STATUS ERROR]', error);
    throw error;
  }
};

// Export для использования
const paymentHandler = {
  processPayment,
  generateKaspiQRCode,
  generateHalykQRCode,
  validateCardData,
  refundPayment,
  saveOrderWithPayment,
  getPaymentStatus,
  PAYMENT_METHODS,
  PAYMENT_STATUS
};

export default paymentHandler;
