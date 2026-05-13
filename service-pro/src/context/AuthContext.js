import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../utils/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(authService.getSession());

  useEffect(() => {
    const stored = authService.getSession();
    if (stored) setSession(stored);
  }, []);

  const signIn = async (payload) => {
    const newSession = await authService.loginUser(payload);
    setSession(newSession);
    return newSession;
  };

  const signUp = async (payload) => {
    const user = await authService.registerUser(payload);
    const newSession = await authService.loginUser({ email: user.email, password: payload.password });
    setSession(newSession);
    return newSession;
  };

  const signInWithOtp = async (payload) => {
    const newSession = await authService.loginWithOtp(payload);
    setSession(newSession);
    return newSession;
  };

  const signInWithGoogle = async (payload) => {
    const newSession = await authService.loginWithGoogle(payload);
    setSession(newSession);
    return newSession;
  };

  const refresh = async () => {
    const newSession = await authService.refreshSession();
    setSession(newSession);
    return newSession;
  };

  const updateSession = (newSession) => {
    setSession(newSession);
  };

  const signOut = () => {
    authService.logoutUser();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      signIn,
      signUp,
      signInWithOtp,
      signInWithGoogle,
      refresh,
      updateSession,
      signOut
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
