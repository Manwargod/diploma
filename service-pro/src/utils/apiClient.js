const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const normalizeBaseUrl = (baseUrl) => (baseUrl ? baseUrl.replace(/\/$/, '') : '');

export const isApiEnabled = () => Boolean(API_BASE_URL);

export const buildApiUrl = (path) => {
  const base = normalizeBaseUrl(API_BASE_URL);
  return `${base}${path}`;
};

export const apiRequest = async (path, options = {}, requireBackend = process.env.NODE_ENV === 'production') => {
  if (!API_BASE_URL) {
    if (requireBackend) {
      throw new Error('BACKEND_REQUIRED');
    }
    throw new Error('API_NOT_CONFIGURED');
  }

  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    throw new Error('BACKEND_REQUIRED');
  }

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message = errorPayload?.message || response.statusText || 'API_REQUEST_FAILED';
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
};

const apiClient = {
  apiRequest,
  isApiEnabled,
  buildApiUrl
};

export default apiClient;
