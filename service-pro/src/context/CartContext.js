import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаём Context для корзины
const CartContext = createContext();

// Custom hook для использования CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен быть использован внутри CartProvider');
  }
  return context;
};

// Provider компонент
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const serverCart = localStorage.getItem('sp_cart_server');
    const savedPromo = localStorage.getItem('promoCode');
    const savedDiscount = localStorage.getItem('discountPercent');
    
    if (serverCart) {
      setItems(JSON.parse(serverCart));
    } else if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedPromo) {
      setPromoCode(savedPromo);
      setDiscountPercent(parseInt(savedDiscount) || 0);
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    localStorage.setItem('sp_cart_server', JSON.stringify(items));
  }, [items]);

  // Добавление товара в корзину
  const addToCart = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Изменение количества товара
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Применение промокода
  const applyPromoCode = (code) => {
    // Пример промокодов
    const promoCodes = {
      'DISCOUNT10': 10,
      'DISCOUNT20': 20,
      'WELCOME': 15,
      'SUMMER2024': 25,
      'KASPI': 5
    };

    if (promoCodes[code.toUpperCase()]) {
      setPromoCode(code.toUpperCase());
      setDiscountPercent(promoCodes[code.toUpperCase()]);
      localStorage.setItem('promoCode', code.toUpperCase());
      localStorage.setItem('discountPercent', promoCodes[code.toUpperCase()]);
      return { success: true, discount: promoCodes[code.toUpperCase()] };
    }
    
    return { success: false, error: 'Неверный промокод' };
  };

  // Удаление промокода
  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    localStorage.removeItem('promoCode');
    localStorage.removeItem('discountPercent');
  };

  // Расчёт подитога (без налогов и скидок)
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

  // Налог (8% в Казахстане для стандартных товаров)
  const taxRate = 0.08;
  const tax = Math.round(subtotal * taxRate * 100) / 100;

  // Скидка от промокода
  const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;

  // Итоговая сумма
  const total = subtotal + tax - discount;

  // Очистка корзины
  const clearCart = () => {
    setItems([]);
    removePromoCode();
    localStorage.removeItem('cart');
  };

  // Получение количества товаров в корзине
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    itemCount,
    subtotal,
    tax,
    discount,
    total,
    promoCode,
    discountPercent,
    isLoading,
    setIsLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
