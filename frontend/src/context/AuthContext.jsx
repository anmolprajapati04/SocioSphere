import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sociosphere_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const [societyName, setSocietyName] = useState(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
        setSocietyId(parsed.societyId || null);
        setSocietyName(parsed.societyName || null);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const payload = { user, token, societyId, societyName };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [user, token, societyId, societyName]);

  async function login({ email, password }) {
    try {
      const resp = await api.post('/auth/login', { email, password });
      const { user, token } = resp.data.data;
      setUser(user);
      setToken(token);
      setSocietyId(user?.society_id || null);
      setSocietyName('SocioSphere Society'); // Placeholder or from user
      return { ok: true, user };
    } catch (e) {
      console.error('Login error:', e);
      return { ok: false, message: e.response?.data?.message || 'Login failed' };
    }
  }

  async function signup(formData) {
    try {
      const resp = await api.post('/auth/register', formData);
      const { user, token } = resp.data.data;
      setUser(user);
      setToken(token);
      setSocietyId(user?.society_id || null);
      setSocietyName(formData.society_name || 'SocioSphere Society');
      return { ok: true, user };
    } catch (e) {
      console.error('Signup error:', e);
      return { ok: false, message: e.response?.data?.message || 'Signup failed' };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setSocietyId(null);
    setSocietyName(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    token,
    societyId,
    societyName,
    login,
    signup,
    logout,
    isAuthenticated: Boolean(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

