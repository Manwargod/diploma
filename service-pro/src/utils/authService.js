import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';
import { signInWithGooglePopup } from './firebase';

const SESSION_KEY = 'sp_session';

const generateToken = (prefix) => `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const normalizeEmail = (email) => email.trim().toLowerCase();

export const registerUser = async ({ email, password, phone, role, name }) => {
  const normalizedEmail = email ? normalizeEmail(email) : '';

  if (!isApiEnabled()) {
    throw new Error('BACKEND_REQUIRED');
  }

  const newUser = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password, phone, role, name })
  });
  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!isApiEnabled()) {
    throw new Error('BACKEND_REQUIRED');
  }

  const session = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password })
  });
  storage.set(SESSION_KEY, session);
  return session;
};

export const sendOtp = async (phone) => {
  if (!isApiEnabled()) throw new Error('BACKEND_REQUIRED');

  await apiRequest('/auth/otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  });
};

export const loginWithOtp = async ({ phone, otp, role, centerId }) => {
  if (!isApiEnabled()) throw new Error('BACKEND_REQUIRED');

  const session = await apiRequest('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp, role, centerId })
  });
  storage.set(SESSION_KEY, session);
  return session;
};

export const loginWithGoogle = async ({ role, centerId }) => {
  if (!isApiEnabled()) throw new Error('BACKEND_REQUIRED');
  const firebaseUser = await signInWithGooglePopup();

  const idToken = await firebaseUser.getIdToken();
  const session = await apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken, role, centerId })
  });
  storage.set(SESSION_KEY, session);
  return session;
};

export const refreshSession = () => {
  const session = storage.get(SESSION_KEY, null);
  if (!session) throw new Error('NO_SESSION');
  const refreshed = {
    ...session,
    accessToken: generateToken('access'),
    refreshedAt: new Date().toISOString()
  };
  storage.set(SESSION_KEY, refreshed);
  return refreshed;
};

export const logoutUser = () => storage.remove(SESSION_KEY);

export const getSession = () => storage.get(SESSION_KEY, null);

export const updateProviderCenter = async ({ userId, centerId }) => {
  if (!isApiEnabled()) throw new Error('BACKEND_REQUIRED');
  const session = await apiRequest('/providers/center', {
    method: 'PATCH',
    body: JSON.stringify({ userId, centerId })
  });
  storage.set(SESSION_KEY, session);
  return session;
};

const authService = {
  registerUser,
  loginUser,
  sendOtp,
  loginWithOtp,
  loginWithGoogle,
  refreshSession,
  logoutUser,
  getSession,
  updateProviderCenter
};

export default authService;
