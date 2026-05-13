import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const INVENTORY_KEY = 'sp_center_inventory';

const getInventory = () => storage.get(INVENTORY_KEY, []);
const saveInventory = (rows) => storage.set(INVENTORY_KEY, rows);

const isActive = (row) => Boolean(row?.is_available && Number(row?.quantity) > 0 && Number(row?.price) > 0);

export const listCenterInventory = async (centerId) => {
  if (isApiEnabled()) {
    const query = centerId ? `?centerId=${encodeURIComponent(centerId)}` : '';
    return apiRequest(`/center-inventory${query}`);
  }
  const rows = getInventory();
  return centerId ? rows.filter((row) => row.service_center_id === centerId) : rows;
};

export const upsertCenterInventory = async ({ centerId, productId, quantity, price, isAvailable }) => {
  const payload = {
    centerId,
    quantity: Number(quantity) || 0,
    price: Number(price) || 0,
    isAvailable: Boolean(isAvailable)
  };

  if (isApiEnabled()) {
    return apiRequest(`/center-inventory/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  const rows = getInventory();
  const productKey = String(productId);
  const now = new Date().toISOString();
  const next = [...rows];
  const existingIdx = next.findIndex((row) => row.service_center_id === centerId && String(row.product_id) === productKey);
  const saved = {
    service_center_id: centerId,
    product_id: productKey,
    quantity: payload.quantity,
    price: payload.price,
    is_available: payload.isAvailable,
    updated_at: now
  };

  if (existingIdx >= 0) {
    next[existingIdx] = saved;
  } else {
    next.push(saved);
  }
  saveInventory(next);
  return saved;
};

export const listMarketInventory = async (productId) => {
  if (isApiEnabled()) {
    const params = new URLSearchParams();
    if (productId !== undefined && productId !== null) params.set('productId', String(productId));
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/center-inventory/market${query}`);
  }

  const rows = getInventory();
  const filtered = rows.filter((row) => (productId === undefined || productId === null ? true : String(row.product_id) === String(productId)));
  return filtered.filter(isActive);
};

const inventoryService = {
  listCenterInventory,
  upsertCenterInventory,
  listMarketInventory
};

export default inventoryService;
