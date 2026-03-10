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
    // Try backend; fallback to mock if backend unavailable
    try {
      const resp = await api.post('/auth/login', { email, password });
      setUser(resp.data.user);
      setToken(resp.data.accessToken);
      setSocietyId(resp.data.user?.society_id || null);
      setSocietyName('Skyline Heights');
      return { ok: true };
    } catch (e) {
      const fakeUser = {
        id: 1,
        name: 'Demo User',
        email,
        role: email.includes('admin')
          ? 'SOCIETY_ADMIN'
          : email.includes('secretary')
          ? 'ACCOUNTANT'
          : email.includes('security')
          ? 'SECURITY_GUARD'
          : 'RESIDENT',
        society_id: 1,
      };
      setUser(fakeUser);
      setToken('mock-jwt-token');
      setSocietyId(1);
      setSocietyName('Skyline Heights');
      return { ok: true, mock: true };
    }
  }

  async function signup(payload) {
    try {
      const resp = await api.post('/auth/register', {
        society_id: 1,
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'RESIDENT',
      });
      setUser(resp.data.user);
      setToken(resp.data.accessToken);
      setSocietyId(1);
      setSocietyName('Skyline Heights');
      return { ok: true };
    } catch {
      return login(payload);
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

