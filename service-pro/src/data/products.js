export const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'smartphones',
    price: 450000,
    rating: 4.8,
    specs: 'A17 Pro, 256GB, Blue Titanium',
    stock: 'Almaty, Astana',
    description: 'Последнее поколение iPhone с мощной камерой и производительностью.',
    features: ['Экран 6.7 дюймов', 'A17 Pro чип', '256GB памяти', 'Керамический щит', 'IP68 защита', 'USB‑C'],
    extendedSpecs: {
      Processor: 'A17 Pro',
      RAM: '8GB',
      Storage: '256GB',
      Display: '6.7" OLED',
      Battery: '4422 mAh',
      Protection: 'IP68'
    },
    reviews: [
      { id: 'r1', name: 'Arman K.', rating: 5, text: 'Камера и экран впечатляют.', date: '2026-01-12', verified: true },
      { id: 'r2', name: 'Aigerim S.', rating: 4, text: 'Очень быстрый, но цена высокая.', date: '2026-02-03', verified: true }
    ]
  },
  {
    id: 2,
    name: 'MacBook Pro M3 14"',
    category: 'laptops',
    price: 980000,
    rating: 4.9,
    specs: 'M3 Chip, 16GB RAM, 512GB SSD',
    stock: 'Almaty',
    description: 'Мощный ноутбук для профессионалов с чипом M3.',
    features: ['14" дисплей Retina', 'M3 чип', '16GB памяти', '512GB SSD', '10‑ядерный GPU', 'До 17 часов работы'],
    extendedSpecs: {
      Processor: 'Apple M3',
      RAM: '16GB',
      Storage: '512GB SSD',
      Display: '14" Retina',
      GPU: '10‑core GPU',
      Battery: '17 часов'
    },
    reviews: [
      { id: 'r3', name: 'Daniyar T.', rating: 5, text: 'Лучший ноутбук для монтажа.', date: '2026-02-18', verified: true }
    ]
  },
  {
    id: 3,
    name: 'RTX 4090 Founders',
    category: 'components',
    price: 1150000,
    rating: 5.0,
    specs: '24GB GDDR6X, DLSS 3.5',
    stock: 'Astana',
    description: 'Флагманская видеокарта NVIDIA для максимальной производительности.',
    features: ['24GB GDDR6X', 'DLSS 3.5', 'Ada архитектура', 'PCIe 4.0', 'Эталонный дизайн', 'Тихое охлаждение'],
    extendedSpecs: {
      Memory: '24GB GDDR6X',
      Architecture: 'Ada Lovelace',
      Interface: 'PCIe 4.0',
      Power: '450W',
      Cooling: 'Triple‑fan',
      Dimensions: '304 mm'
    },
    reviews: [
      { id: 'r4', name: 'Marat P.', rating: 5, text: 'FPS зашкаливает.', date: '2026-03-01', verified: true }
    ]
  },
  {
    id: 4,
    name: 'Samsung S24 Ultra',
    category: 'smartphones',
    price: 520000,
    rating: 4.7,
    specs: 'Snapdragon 8 Gen 3, 512GB',
    stock: 'Shymkent, Almaty',
    description: 'Премиум смартфон Samsung с лучшей камерой.',
    features: ['6.8" AMOLED', 'Snapdragon 8 Gen 3', '512GB памяти', '200MP камера', 'IP68', '45W зарядка'],
    extendedSpecs: {
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12GB',
      Storage: '512GB',
      Display: '6.8" AMOLED',
      Camera: '200MP',
      Protection: 'IP68'
    },
    reviews: [
      { id: 'r5', name: 'Dana Z.', rating: 4, text: 'Отличный экран и камера.', date: '2026-02-22', verified: true }
    ]
  },
  {
    id: 5,
    name: 'ASUS ROG Zephyrus G16',
    category: 'laptops',
    price: 860000,
    rating: 4.6,
    specs: 'Intel i9, RTX 4070, 32GB RAM, 1TB SSD',
    stock: 'Almaty, Astana',
    description: 'Тонкий игровой ноутбук с мощной графикой и высокой частотой экрана.',
    features: ['16" 240Hz', 'RTX 4070', '32GB RAM', '1TB SSD', 'Wi‑Fi 6E', 'RGB клавиатура'],
    extendedSpecs: {
      Processor: 'Intel Core i9',
      RAM: '32GB',
      Storage: '1TB SSD',
      Display: '16" 240Hz',
      GPU: 'RTX 4070',
      Weight: '1.9 kg'
    },
    reviews: []
  },
  {
    id: 6,
    name: 'Galaxy Tab S9 Ultra',
    category: 'smartphones',
    price: 410000,
    rating: 4.5,
    specs: '14.6" AMOLED, 12GB RAM, 256GB',
    stock: 'Almaty',
    description: 'Большой AMOLED планшет для работы и развлечений.',
    features: ['14.6" AMOLED', '12GB RAM', '256GB', 'S Pen', 'IP68', '120Hz'],
    extendedSpecs: {
      Processor: 'Snapdragon 8 Gen 2',
      RAM: '12GB',
      Storage: '256GB',
      Display: '14.6" AMOLED',
      Battery: '11200 mAh',
      Protection: 'IP68'
    },
    reviews: []
  },
  {
    id: 7,
    name: 'AMD Ryzen 7 7800X3D',
    category: 'components',
    price: 185000,
    rating: 4.9,
    specs: '8-core, 16-thread, 3D V-Cache',
    stock: 'Astana, Shymkent',
    description: 'Лучший процессор для игровых сборок с 3D V-Cache.',
    features: ['8C/16T', '3D V-Cache', '5.0 GHz', 'AM5', 'PCIe 5.0', 'TDP 120W'],
    extendedSpecs: {
      Cores: '8',
      Threads: '16',
      Boost: '5.0 GHz',
      Socket: 'AM5',
      Cache: '96MB',
      TDP: '120W'
    },
    reviews: []
  },
  {
    id: 8,
    name: 'Corsair Vengeance DDR5 64GB',
    category: 'components',
    price: 98000,
    rating: 4.7,
    specs: '64GB (2x32), 6000MHz',
    stock: 'Almaty',
    description: 'Высокоскоростная DDR5 память для производительных систем.',
    features: ['64GB kit', '6000MHz', 'CL36', 'XMP 3.0', 'Heat spreader', 'Low profile'],
    extendedSpecs: {
      Capacity: '64GB',
      Speed: '6000MHz',
      Latency: 'CL36',
      Voltage: '1.35V',
      Form: 'UDIMM',
      Profile: 'XMP 3.0'
    },
    reviews: []
  }
];

export default products;
