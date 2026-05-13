import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const REQUESTS_KEY = 'sp_requests';
const WARRANTIES_KEY = 'sp_warranties';

const getRequests = () => storage.get(REQUESTS_KEY, []);
const saveRequests = (requests) => storage.set(REQUESTS_KEY, requests);

export const createRepairRequest = async (payload) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest('/repairs', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  const requests = getRequests();
  const newRequest = {
    id: `SP-${Date.now()}`,
    type: 'repair',
    status: 'received',
    timeline: [
      { status: 'received', label: 'Received', timestamp: new Date().toISOString(), media: [] }
    ],
    ...payload,
    createdAt: new Date().toISOString()
  };

  saveRequests([newRequest, ...requests]);

  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldFail = Math.random() < 0.05;
        if (shouldFail) reject(new Error('REQUEST_FAILED'));
        else resolve(true);
      }, 600);
    });
    return newRequest;
  } catch (error) {
    saveRequests(requests);
    throw error;
  }
};

export const updateRepairStatus = async (requestId, status, label) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest(`/repairs/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, label })
    });
  }

  const requests = getRequests();
  const updated = requests.map((req) => {
    if (req.id !== requestId) return req;
    return {
      ...req,
      status,
      timeline: [
        ...req.timeline,
        { status, label, timestamp: new Date().toISOString(), media: [] }
      ]
    };
  });
  saveRequests(updated);
  return updated.find((req) => req.id === requestId);
};

export const addRepairMedia = async (requestId, stageStatus, mediaItems) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest(`/repairs/${requestId}/media`, {
      method: 'POST',
      body: JSON.stringify({ stageStatus, mediaItems })
    });
  }

  const requests = getRequests();
  const updated = requests.map((req) => {
    if (req.id !== requestId) return req;
    const timeline = req.timeline.map((step) => {
      if (step.status !== stageStatus) return step;
      return { ...step, media: [...(step.media || []), ...mediaItems] };
    });
    return { ...req, timeline };
  });
  saveRequests(updated);
  return updated.find((req) => req.id === requestId);
};

export const listClientRequests = async (clientId) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest(`/repairs?clientId=${encodeURIComponent(clientId)}`);
  }
  return getRequests().filter((req) => req.clientId === clientId);
};

export const listProviderRequests = async (centerId) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest(`/repairs?centerId=${encodeURIComponent(centerId)}`);
  }
  return getRequests().filter((req) => req.serviceCenter?.id === centerId);
};

export const storeWarranty = async (warranty) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    await apiRequest('/warranties', {
      method: 'POST',
      body: JSON.stringify(warranty)
    });
    return;
  }

  const warranties = storage.get(WARRANTIES_KEY, []);
  storage.set(WARRANTIES_KEY, [warranty, ...warranties]);
};

export const listWarranties = async () => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest('/warranties');
  }
  return storage.get(WARRANTIES_KEY, []);
};

const requestService = {
  createRepairRequest,
  updateRepairStatus,
  addRepairMedia,
  listClientRequests,
  listProviderRequests,
  storeWarranty,
  listWarranties
};

export default requestService;
