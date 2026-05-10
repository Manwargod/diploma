# [CODE] Примеры кода для Service Market

## [1] Добавление товара программно

### Пример: Добавление товара через форму

```javascript
// src/pages/AdminAddProduct.js (новая страница для админа)

import React, { useState } from 'react';

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'smartphones',
    price: '',
    rating: 4.5,
    specs: '',
    stock: ''
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля!');
      return;
    }

    // TODO: Отправить на сервер
    console.log('Новый товар:', formData);
    
    // Очистить форму
    setFormData({
      name: '',
      category: 'smartphones',
      price: '',
      rating: 4.5,
      specs: '',
      stock: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-black">Добавить товар</h1>
      
      <form onSubmit={handleAddProduct} className="space-y-4 bg-white/5 p-6 rounded-2xl">
        <input
          type="text"
          placeholder="Название товара"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
          required
        />
        
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="smartphones">Смартфоны</option>
          <option value="laptops">Ноутбуки</option>
          <option value="components">Компоненты</option>
        </select>

        <input
          type="number"
          placeholder="Цена (в ₸)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
          required
        />

        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Рейтинг (1-5)"
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
        />

        <textarea
          placeholder="Краткие характеристики"
          value={formData.specs}
          onChange={(e) => setFormData({...formData, specs: e.target.value})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
          rows="3"
        />

        <input
          type="text"
          placeholder="Склады (Almaty, Astana, Shymkent)"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] text-black font-black rounded-xl hover:scale-105 transition-all"
        >
          Добавить товар
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
```

---

## [2] Интеграция с корзиной

### Пример: Store Context для корзины

```javascript
// src/context/CartContext.js

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен быть внутри CartProvider');
  }
  return context;
};
```

### Использование в Market.js:

```javascript
import { useCart } from '../context/CartContext';

const Market = ({ isDark, t }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Показать уведомление
    alert(`${product.name} добавлен в корзину!`);
  };

  // ... остальной код
};
```

---

## [3] Расширенная фильтрация

### Пример: Добавить сортировку

```javascript
// src/pages/Market.js - добавить в компонент

const [sortBy, setSortBy] = useState('popular');

// Функция для сортировки
const getSortedProducts = (products) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => 
        parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''))
      );
    
    case 'price-desc':
      return sorted.sort((a, b) => 
        parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''))
      );
    
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case 'newest':
      return sorted.reverse();
    
    default: // popular
      return sorted;
  }
};

// В JSX добавить селект для сортировки
<div className="flex justify-between items-center mb-6">
  <p className="text-sm opacity-50">Найдено: {filtered.length} товаров</p>
  
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-bold"
  >
    <option value="popular">Популярные</option>
    <option value="newest">Новые</option>
    <option value="price-asc">Дешевле первыми</option>
    <option value="price-desc">Дороже первыми</option>
    <option value="rating">По рейтингу</option>
  </select>
</div>

// И изменить отрисовку
const sortedProducts = getSortedProducts(filtered);

{sortedProducts.map(product => (
  <ProductCard key={product.id} product={product} {...props} />
))}
```

---

## [4] Сохранение избранного

### Пример: Локальное хранилище для wishlist

```javascript
// src/hooks/useWishlist.js

import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const STORAGE_KEY = 'service_market_wishlist';

  // Загрузить из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  // Сохранить в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return { wishlist, toggleWishlist, isInWishlist };
};
```

### Использование в ProductCard:

```javascript
import { useWishlist } from '../hooks/useWishlist';
import { Heart } from 'lucide-react';

const ProductCard = ({ product, isDark, ... }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="...">
      {/* ... существующий код ... */}
      
      {/* Кнопка в углу карточки */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur hover:bg-white/20 rounded-xl transition-all"
      >
        <Heart
          size={20}
          className={inWishlist ? 'fill-red-500 text-red-500' : 'text-white'}
        />
      </button>
    </div>
  );
};
```

---

## [5] Интеграция с Kaspi API (Казахстан)

### Пример: Платежная система

```javascript
// src/services/paymentService.js

export const initiateKaspiPayment = async (order) => {
  try {
    const response = await fetch('https://kaspi.kz/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_KASPI_API_KEY}`
      },
      body: JSON.stringify({
        amount: order.totalPrice * 100, // В копейках
        currency: 'KZT',
        description: `Заказ #${order.id}`,
        returnUrl: window.location.origin + '/order/success',
        cancelUrl: window.location.origin + '/order/cancel'
      })
    });

    const data = await response.json();
    
    if (data.status === 'ok') {
      // Перенаправить на страницу платежа
      window.location.href = data.url;
    } else {
      throw new Error('Ошибка инициализации платежа');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Ошибка при обработке платежа');
  }
};
```

---

## [6] Загрузка изображений товаров

### Пример: Компонент для загрузки изображений

```javascript
// src/components/ImageUpload.js

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, isDark }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Проверка размера (макс 5МБ)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5МБ');
        return;
      }

      // Создание превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`border-2 border-dashed rounded-2xl p-6 text-center ${
      isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/2'
    }`}>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="w-40 h-40 rounded-lg object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <Upload size={32} className="opacity-50" />
          <span className="font-bold text-sm">Нажмите для загрузки изображения</span>
          <span className="text-xs opacity-50">или перетащите файл</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
```

---

## [7] Поиск с автодополнением

### Пример: Smart Search

```javascript
// src/components/SmartSearch.js

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SmartSearch = ({ products, isDark, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Получить уникальные имена товаров
  const productNames = [...new Set(products.map(p => p.name))];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = productNames.filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Макс 5 подсказок
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (name) => {
    const product = products.find(p => p.name === name);
    onSelect(product);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <div className={`relative flex items-center rounded-2xl border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-black/10'
      }`}>
        <Search className="absolute left-4 opacity-30" size={20} />
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          className="w-full pl-12 pr-6 py-4 bg-transparent outline-none text-white font-bold"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 p-1 hover:bg-white/10 rounded transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Список подсказок */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border z-10 ${
          isDark
            ? 'bg-[#0f0f12] border-white/10'
            : 'bg-white border-black/10'
        }`}>
          {suggestions.map((name, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(name)}
              className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-all font-bold first:rounded-t-lg last:rounded-b-lg ${
                idx !== suggestions.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
```

---

## [8] Analytics и отслеживание

### Пример: Event tracking

```javascript
// src/utils/analytics.js

export const trackEvent = (eventName, eventData = {}) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Яндекс.Метрика
  if (window.ym) {
    window.ym(process.env.REACT_APP_YANDEX_METRIKA_ID, 'reachGoal', eventName);
  }

  console.log(`[STATS] Event: ${eventName}`, eventData);
};

// Использование
export const useAnalytics = () => {
  const trackProductView = (productId, productName) => {
    trackEvent('view_item', {
      item_id: productId,
      item_name: productName
    });
  };

  const trackAddToCart = (productId, price) => {
    trackEvent('add_to_cart', {
      item_id: productId,
      value: price,
      currency: 'KZT'
    });
  };

  const trackPurchase = (totalPrice, itemCount) => {
    trackEvent('purchase', {
      value: totalPrice,
      currency: 'KZT',
      items: itemCount
    });
  };

  return { trackProductView, trackAddToCart, trackPurchase };
};
```

---

**Все примеры готовы к использованию! Копируйте и адаптируйте под свой проект.** [LAUNCH]
