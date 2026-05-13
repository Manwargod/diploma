import storage from './storage';

const PROFILE_KEY = 'sp_profiles';

const getProfiles = () => storage.get(PROFILE_KEY, {});
const saveProfiles = (profiles) => storage.set(PROFILE_KEY, profiles);

export const getProfile = (userId) => {
  if (!userId) return null;
  return getProfiles()[userId] || null;
};

export const saveProfile = (userId, profile) => {
  if (!userId) return null;
  const profiles = getProfiles();
  const nextProfile = {
    ...profiles[userId],
    ...profile,
    updatedAt: new Date().toISOString()
  };
  profiles[userId] = nextProfile;
  saveProfiles(profiles);
  return nextProfile;
};

export const mergeProfileFromSubmission = (userId, payload) => {
  if (!userId) return null;
  const current = getProfile(userId) || {};
  return saveProfile(userId, {
    name: payload.name || payload.fullName || current.name || '',
    phone: payload.phone || current.phone || '',
    address: payload.address || payload.deliveryAddress || current.address || ''
  });
};

const profileService = {
  getProfile,
  saveProfile,
  mergeProfileFromSubmission
};

export default profileService;
