import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('auth_user'),
        ]);
        setToken(t);
        setUser(u ? JSON.parse(u) : null);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async ({ token: jwt, user: profile }) => {
    await AsyncStorage.setItem('auth_token', jwt);
    await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
    setToken(jwt);
    setUser(profile);
  }, []);

  const signOut = useCallback(async () => {
    try { await authApi.post('/api/auth/logout'); } catch {}
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, token, loading, signIn, signOut, isAdmin: user?.role === 'admin' }), [user, token, loading, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
