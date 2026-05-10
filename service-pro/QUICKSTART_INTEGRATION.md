# [QUICKSTART] Интеграция системы корзины и платежей

**Версия:** 1.0  
**Статус:** [COMPLETE] Ready to integrate

---

## [STEP 1] Обновить App.js

```javascript
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <div>
        {/* Навигация с кнопкой корзины */}
        <header>
          <button onClick={() => setCartOpen(true)}>
            Корзина
          </button>
        </header>

        {/* CartDrawer */}
        <CartDrawer
          isDark={isDark}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
        />

        {/* Роуты */}
        <Routes>
          <Route path="/checkout" element={<Checkout isDark={isDark} t={t} />} />
          {/* ... остальные роуты ... */}
        </Routes>
      </div>
    </CartProvider>
  );
}
```

---

## [STEP 2] Добавить кнопку "Добавить в корзину" в Product Card

```javascript
import { useCart } from '../context/CartContext';

function ProductCard({ product, isDark }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    
    // Показать уведомление
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div>
      {/* ... информация о товаре ... */}
      <button
        onClick={handleAdd}
        className="bg-[#00f2ff] text-black font-black px-6 py-3 rounded-xl"
      >
        [SHOPPING_BAG] Добавить в корзину
      </button>
      
      {showToast && (
        <div className="p-4 bg-emerald-500 text-white rounded-lg">
          Товар добавлен в корзину!
        </div>
      )}
    </div>
  );
}
```

---

## [STEP 3] Отобразить количество товаров в Navbar

```javascript
import { useCart } from '../context/CartContext';

function Navbar() {
  const { itemCount, total } = useCart();

  return (
    <nav>
      <div className="flex items-center gap-4">
        <span>Товаров: {itemCount}</span>
        <span className="text-[#00f2ff] font-black">
          {total.toLocaleString('ru-RU')} ₸
        </span>
      </div>
    </nav>
  );
}
```

---

## [VERIFICATION] Проверка работы

### Пункт 1: CartContext загружается
```javascript
// В консоли браузера
localStorage.getItem('cart')  // Должна быть корзина
localStorage.getItem('promoCode')  // Опционально
```

### Пункт 2: Товар добавляется
```javascript
// 1. Кликнуть "Добавить в корзину"
// 2. Проверить: localStorage обновился
// 3. Проверить: CartDrawer показывает товар
// 4. Проверить: itemCount увеличился
```

### Пункт 3: Checkout работает
```javascript
// 1. Открыть /checkout
// 2. Заполнить данные доставки
// 3. Выбрать способ оплаты
// 4. Нажать кнопку платежа
// 5. Увидеть успех (mock платёж)
```

---

## [TESTING] Тестовые сценарии

### [TEST 1] Добавление товаров
```
✓ Товар добавляется в корзину
✓ Количество увеличивается при повторном добавлении
✓ Итоги пересчитываются
✓ Данные сохраняются в localStorage
```

### [TEST 2] CartDrawer
```
✓ Drawer открывается при клике на корзину
✓ Отображается список товаров
✓ Можно изменить количество (+ / -)
✓ Можно удалить товар
✓ Показаны итоги (подитого, налог, скидка)
✓ Есть кнопка "Оформить заказ"
```

### [TEST 3] Checkout
```
✓ Шаг 1: Проверка корзины
✓ Шаг 2: Ввод данных доставки с валидацией
✓ Шаг 3: Выбор способа оплаты
✓ Шаг 4: Успешный платёж → ID заказа
```

### [TEST 4] Способы оплаты

#### Kaspi QR
```
✓ Кнопка "Получить QR код" работает
✓ QR код отображается (имитация)
✓ Можно скопировать номер телефона
✓ Платёж обрабатывается (~3 сек)
✓ Успешный результат с ID транзакции
```

#### Halyk QR
```
✓ Кнопка "Получить QR код" работает
✓ Отображается счёт и BIC код
✓ Платёж обрабатывается дольше (~4 сек)
✓ Успешный результат
```

#### Банковская карта
```
✓ Маски ввода работают правильно
✓ Валидация Luhn algorithm работает
✓ Срок действия проверяется
✓ CVV только 3 цифры
✓ Успешный платёж (90%) / ошибка (10%)
```

### [TEST 5] Промокоды
```
✓ DISCOUNT10 → 10% скидка
✓ DISCOUNT20 → 20% скидка
✓ WELCOME → 15% скидка
✓ SUMMER2024 → 25% скидка
✓ KASPI → 5% скидка
✓ Невалидный код → ошибка
```

---

## [TROUBLESHOOTING] Решение проблем

### Проблема: CartContext не найден

**Решение:**
```javascript
// Убедитесь, что App.js обёрнут в CartProvider
<CartProvider>
  <App />
</CartProvider>
```

### Проблема: Корзина не сохраняется

**Решение:**
```javascript
// Проверьте localStorage в DevTools
// localStorage → cart должен быть JSON
// Если пустой, очистите: localStorage.clear()
```

### Проблема: Стили не работают

**Решение:**
```javascript
// Убедитесь, что Tailwind CSS установлен
npm install -D tailwindcss
// И скомпилирован в build
```

### Проблема: Иконки не отображаются

**Решение:**
```javascript
// Lucide React должен быть установлен
npm install lucide-react
// И импортирован в компонент
import { ShoppingBag } from 'lucide-react';
```

---

## [NEXT_STEPS] Что дальше

### На production:
1. Замените mock платежи на реальные API
2. Добавьте backend для сохранения заказов
3. Реализуйте email уведомления
4. Добавьте личный кабинет с историей заказов
5. Интегрируйте реальный Kaspi/Halyk API

### Для улучшений:
1. Добавьте валидацию промокодов на сервере
2. Реализуйте цены доставки по регионам
3. Добавьте отслеживание заказа (tracking)
4. Реализуйте return/refund функционал
5. Добавьте wishlist (избранное)

---

## [FILES_CREATED] Созданные файлы

```
src/
├── context/
│   └── CartContext.js                 # Управление корзиной
├── components/
│   ├── CartDrawer.js                  # Боковая панель
│   └── payments/
│       ├── KaspiQRPayment.js           # Kaspi QR
│       ├── HalykQRPayment.js           # Halyk QR
│       └── BankCardPayment.js          # Карта
├── pages/
│   └── Checkout.js                    # Оформление заказа
└── utils/
    └── PaymentHandler.js              # Mock платежи

Документация:
├── CART_AND_PAYMENT_GUIDE.md          # Полное руководство
├── DATA_STRUCTURES.json               # Структуры данных
└── QUICKSTART_INTEGRATION.md          # Этот файл
```

---

## [SUPPORT] Поддержка

Если возникают вопросы:
1. Смотрите [CART_AND_PAYMENT_GUIDE.md](CART_AND_PAYMENT_GUIDE.md)
2. Проверьте примеры в CODE_EXAMPLES раздела
3. Используйте browser DevTools → Console
4. Проверьте localStorage в DevTools

---

**Готово к use!** 🚀

Вся система работает и полностью интегрируется с вашим приложением.
