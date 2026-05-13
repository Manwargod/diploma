import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const PRODUCTS_KEY = 'sp_products';

const getProducts = () => storage.get(PRODUCTS_KEY, []);
const saveProducts = (products) => storage.set(PRODUCTS_KEY, products);

export const listProducts = async () => {
  if (isApiEnabled()) {
    return apiRequest('/products');
  }
  return getProducts();
};

export const createProduct = async (payload) => {
  if (!isApiEnabled()) throw new Error('BACKEND_REQUIRED');

  if (isApiEnabled()) {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  const existing = getProducts();
  const created = {
    id: Date.now(),
    ...payload
  };
  saveProducts([created, ...existing]);
  return created;
};

const productService = {
  listProducts,
  createProduct
};

export default productService;
