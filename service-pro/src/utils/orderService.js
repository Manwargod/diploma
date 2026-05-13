import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const ORDERS_KEY = 'sp_orders';

const getOrders = () => storage.get(ORDERS_KEY, []);
const saveOrders = (orders) => storage.set(ORDERS_KEY, orders);

export const createOrder = async (order) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  const existing = getOrders();
  const savedOrder = {
    orderId: order.orderId || `ORD-${Date.now()}`,
    ...order,
    serviceCenterId: order.serviceCenterId || order.service_center_id || null,
    createdAt: order.createdAt || new Date().toISOString()
  };
  saveOrders([savedOrder, ...existing]);
  return savedOrder;
};

export const listOrders = async (clientId, centerId) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    const params = new URLSearchParams();
    if (clientId) params.set('clientId', clientId);
    if (centerId) params.set('centerId', centerId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/orders${query}`);
  }

  const orders = getOrders();
  let filtered = orders;
  if (clientId) {
    filtered = filtered.filter((order) => order.clientId === clientId);
  }
  if (centerId) {
    filtered = filtered.filter((order) => order.serviceCenterId === centerId || order.service_center_id === centerId);
  }
  return filtered.length ? filtered : orders;
};

export const cancelOrder = async (orderId) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PATCH'
    });
  }

  const orders = getOrders();
  const updated = orders.map((order) =>
    order.orderId === orderId ? { ...order, status: 'cancelled', cancelledAt: new Date().toISOString() } : order
  );
  saveOrders(updated);
  return updated.find((order) => order.orderId === orderId);
};

const orderService = {
  createOrder,
  listOrders,
  cancelOrder
};

export default orderService;
