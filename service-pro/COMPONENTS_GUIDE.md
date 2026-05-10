# [GUIDE] Руководство по новым компонентам Service Market

## [COMPONENTS] Новые компоненты

### 1. **ComparisonTable.js** - Таблица сравнения товаров
Позволяет пользователям сравнить до 4 товаров по всем характеристикам.

**Использование:**
```jsx
import ComparisonTable from '../components/ComparisonTable';

<ComparisonTable
  products={selectedProducts}
  isDark={isDark}
  t={translations}
  onClose={() => setShowComparison(false)}
/>
```

**Особенности:**
- [CHECK] Modal с полной таблицей сравнения
- [CHECK] Коллапсируемые категории характеристик
- [CHECK] Визуальное выделение преимуществ
- [CHECK] Кнопки "Купить" для каждого товара

---

### 2. **ProductCard.js** - Улучшенная карточка товара
Компонент для отображения товара с быстрыми действиями.

**Использование:**
```jsx
import ProductCard from '../components/ProductCard';

<ProductCard
  product={product}
  isDark={isDark}
  onCompare={handleCompare}
  onAddToCart={handleAddToCart}
/>
```

**Особенности:**
- [CHECK] Overlay при наведении с кнопками
- [CHECK] Быстрое добавление в корзину
- [CHECK] Кнопка сравнения ([BALANCE])
- [CHECK] Рейтинг и статус доступности

---

### 3. **Filters.js** - Боковая панель фильтров
Компонент для фильтрации товаров по цене, бренду и рейтингу.

**Использование:**
```jsx
import Filters from '../components/Filters';

<Filters 
  isDark={isDark}
  onFilterChange={(filters) => setFilters(filters)}
  t={translations}
/>
```

**Фильтры:**
- 💰 **Цена**: Диапазон от 0 до 1,500,000 ₸
- 🏢 **Бренд**: Apple, Samsung, NVIDIA, Intel, AMD, Lenovo
- ⭐ **Рейтинг**: От 1 до 5 звёзд

---

## 🎨 Стилизация и цвета

### Основные цвета:
```css
Cyan/Голубой:    #00f2ff
Purple/Фиолетовый: #7000ff
Black/Чёрный:     #000000
White/Белый:      #ffffff
```

### Тёмный режим:
```css
Background:      #000000
Card Background: #0f0f12
Border:          rgba(255, 255, 255, 0.05)
Text:            rgba(255, 255, 255, 0.7)
```

### Светлый режим:
```css
Background:      #ffffff
Card Background: #ffffff
Border:          rgba(0, 0, 0, 0.05)
Text:            rgba(0, 0, 0, 0.7)
```

---

## 📝 Структура товара (продукта)

```javascript
{
  id: 1,
  name: "iPhone 15 Pro Max",
  category: "smartphones",
  price: "450 000 ₸",
  rating: 4.8,
  specs: "A17 Pro, 256GB, Blue Titanium",
  stock: "Almaty, Astana",
  fullSpecs: [
    {
      category: "Процессор",
      label: "Чип",
      value: "A17 Pro",
      hasFeature: true
    },
    // ... остальные характеристики
  ]
}
```

---

## 🔧 Как добавить новый товар

1. **Добавьте товар в массив `products`** в `Market.js`:

```javascript
{
  id: 5,
  name: "Новый товар",
  category: "smartphones", // all, smartphones, laptops, components
  price: "150 000 ₸",
  rating: 4.6,
  specs: "Краткие характеристики",
  stock: "Almaty, Astana, Shymkent",
  fullSpecs: [
    {
      category: "Категория 1",
      label: "Параметр 1",
      value: "Значение",
      hasFeature: true // true если это преимущество
    },
    // ... остальные параметры
  ]
}
```

2. **Добавьте новую категорию** (если нужна):

```javascript
const categories = [
  { id: 'all', label: t?.allCategory || 'Все' },
  { id: 'tablets', label: 'Планшеты' }, // новая категория
  // ...
];
```

---

## 🎯 Функции обработки

### Добавление в корзину:
```javascript
const handleAddToCart = (product) => {
  console.log('Added to cart:', product.name);
  // TODO: Реализовать логику добавления в корзину
  // dispatch(addToCart(product));
};
```

### Сравнение товаров:
```javascript
const handleCompare = (product) => {
  if (compareList.find(p => p.id === product.id)) {
    // Товар уже в сравнении - удалить
    setCompareList(compareList.filter(p => p.id !== product.id));
  } else if (compareList.length < 4) {
    // Добавить товар в сравнение
    setCompareList([...compareList, product]);
  }
};
```

---

## 📱 Адаптивность

Компоненты полностью адаптивны для:
- 📱 Мобильные устройства (< 640px)
- 📱 Планшеты (640px - 1024px)
- 💻 Десктопы (> 1024px)

**Брейкпоинты Tailwind:**
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## ⚡ Производительность

### Оптимизации:
- ✅ Ленивая загрузка изображений (реализовать с Intersection Observer)
- ✅ Мемоизация компонентов (использовать React.memo)
- ✅ Виртуализация списка при 100+ товарах

**TODO для оптимизации:**
```javascript
// Добавить мемоизацию
const ProductCard = React.memo(({ product, isDark, ... }) => {
  return (...)
});
```

---

## 🔐 Безопасность и валидация

### Проверка данных товара:
```javascript
const validateProduct = (product) => {
  return (
    product.id &&
    product.name &&
    product.price &&
    product.rating >= 0 && product.rating <= 5 &&
    product.fullSpecs?.length > 0
  );
};
```

---

## 🐛 Типичные проблемы и решения

### Проблема 1: Сравнение не работает
**Решение:** Убедитесь, что каждый товар имеет `fullSpecs`:
```javascript
// ❌ Неправильно
product.specs = "A17 Pro, 256GB"

// ✅ Правильно
product.fullSpecs = [
  { category: "...", label: "...", value: "...", hasFeature: true }
]
```

### Проблема 2: Фильтры не работают
**Решение:** Проверьте, что цена в товаре парсится как число:
```javascript
// Извлечение числа из цены
const priceNumber = parseInt(product.price.replace(/\D/g, ''));
```

### Проблема 3: Стили не применяются
**Решение:** Убедитесь, что Tailwind CSS подключен в `index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📚 Дополнительные ресурсы

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🚀 Следующие шаги

1. **Реализовать корзину** (Shopping Cart)
2. **Добавить Payment Gateway** (Kaspi.kz)
3. **Интегрировать с базой данных** (Firebase/MongoDB)
4. **Создать Admin Panel** для управления товарами
5. **Расширить каталог** (100+ товаров)
6. **Добавить рецензии и отзывы**

---

**Последнее обновление:** 8 Май 2026
