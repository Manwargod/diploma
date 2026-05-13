import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

export const isFirebaseConfigured = () => Object.values(firebaseConfig).every(Boolean);

export const getFirebaseAuth = () => {
  if (!isFirebaseConfigured()) return null;
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getAuth();
};

export const signInWithGooglePopup = async () => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('OAUTH_NOT_CONFIGURED');
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

const firebaseUtils = {
  getFirebaseAuth,
  signInWithGooglePopup,
  isFirebaseConfigured
};

export default firebaseUtils;
