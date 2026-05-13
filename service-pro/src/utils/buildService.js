import storage from './storage';
import { apiRequest, isApiEnabled } from './apiClient';

const BUILDS_KEY = 'sp_builds';

const getBuilds = () => storage.get(BUILDS_KEY, []);
const saveBuilds = (builds) => storage.set(BUILDS_KEY, builds);

export const createBuild = async (build) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    return apiRequest('/builds', {
      method: 'POST',
      body: JSON.stringify(build)
    });
  }

  const existing = getBuilds();
  const savedBuild = {
    id: build.id || `BUILD-${Date.now()}`,
    ...build,
    createdAt: build.createdAt || new Date().toISOString()
  };
  saveBuilds([savedBuild, ...existing]);
  return savedBuild;
};

export const listBuilds = async (clientId) => {
  if (!isApiEnabled() && process.env.NODE_ENV === 'production') {
    throw new Error('BACKEND_REQUIRED');
  }
  if (isApiEnabled()) {
    const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';
    return apiRequest(`/builds${query}`);
  }

  const builds = getBuilds();
  if (!clientId) return builds;
  const filtered = builds.filter((build) => build.clientId === clientId);
  return filtered.length ? filtered : builds;
};

const buildService = {
  createBuild,
  listBuilds
};

export default buildService;
