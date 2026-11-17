import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getAuthToken, setAuthToken, setUnauthorizedHandler, clearCache } from '../api/client';
import { login as apiLogin, me as apiMe, logout as apiLogout, register as apiRegister } from '../api/auth';

const AUTH_USER_KEY = 'auth_user';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
  });

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setCurrentUser(null);
      localStorage.removeItem(AUTH_USER_KEY);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const token = getAuthToken();
      if (!token) { if (!cancelled) setAuthLoading(false); return; }
      try {
        const user = await apiMe();
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        if (!cancelled) setCurrentUser(user);
      } catch (err) {
        console.error('[Auth] apiMe() failed:', err);
        if (err.status === 401) {
          setAuthToken(null);
          localStorage.removeItem(AUTH_USER_KEY);
          if (!cancelled) setCurrentUser(null);
        } else {
          const cached = localStorage.getItem(AUTH_USER_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (!cancelled) setCurrentUser(parsed);
            } catch { if (!cancelled) setCurrentUser(null); }
          } else {
            if (!cancelled) setCurrentUser(null);
          }
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const user = await apiLogin({ email, password });
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const signup = useCallback(async ({ name, email, password, id, role }) => {
    const user = await apiRegister({ name, email, password, empId: id, role });
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    clearCache();

    apiLogout().catch(err => {
      console.warn("Background API logout request failed:", err);
    });
  }, []);

  const updateUserProfile = useCallback((updates) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = useMemo(() => ({
    currentUser, authLoading, rememberMe, setRememberMe,
    settings, updateSettings, login, signup, logout, updateUserProfile,
  }), [currentUser, authLoading, rememberMe, settings, updateSettings, login, signup, logout, updateUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
