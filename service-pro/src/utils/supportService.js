import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const THREAD_KEY = 'sp_support_thread_id';
const HISTORY_KEY = 'sp_support_history';

export const getSupportThreadId = () => {
  let threadId = storage.get(THREAD_KEY, null);
  if (!threadId) {
    threadId = `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    storage.set(THREAD_KEY, threadId);
  }
  return threadId;
};

export const listSupportMessages = async (threadId) => {
  if (isApiEnabled()) {
    return apiRequest(`/support/messages?threadId=${encodeURIComponent(threadId)}`);
  }
  return storage.get(HISTORY_KEY, []);
};

export const sendSupportMessage = async ({ threadId, message, senderName }) => {
  if (isApiEnabled()) {
    return apiRequest('/support/messages', {
      method: 'POST',
      body: JSON.stringify({ threadId, message, senderName })
    });
  }

  const history = storage.get(HISTORY_KEY, []);
  const payload = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: message,
    senderName: senderName || 'User',
    createdAt: new Date().toISOString(),
    status: 'sent'
  };
  storage.set(HISTORY_KEY, [...history, payload]);
  return { saved: true, message: payload };
};

const supportService = {
  getSupportThreadId,
  listSupportMessages,
  sendSupportMessage
};

export default supportService;
