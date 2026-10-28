import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('krishimitra_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.token) {
        localStorage.setItem('krishimitra_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.error || 'Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (farmerData) => {
    setError(null);
    try {
      const response = await authApi.register(farmerData);
      if (response.success && response.token) {
        localStorage.setItem('krishimitra_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.error || 'Registration failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const response = await authApi.demoLogin();
      if (response.success && response.token) {
        localStorage.setItem('krishimitra_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      throw new Error(response.error || 'Demo login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('krishimitra_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await authApi.getMe();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
  };

  const isDemoAccount = user?.email === 'demo@krishimitra.agr' || user?.id === 'demo-farmer-mce-001';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        isDemoAccount,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
