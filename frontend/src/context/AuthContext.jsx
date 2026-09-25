import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token and initial profile if available
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/api/auth/me');
          if (res.data && res.data.user) {
            const normalizedUser = {
              ...res.data.user,
              id: res.data.user.id || res.data.user._id,
              _id: res.data.user._id || res.data.user.id,
            };
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.response?.data?.error || err.message);
          // If token is invalid/expired, reset auth state
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    const rawUser = receivedUser || {
      id: response.data.id || response.data._id,
      _id: response.data._id || response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
    };

    const userData = {
      ...rawUser,
      id: rawUser.id || rawUser._id,
      _id: rawUser._id || rawUser.id,
    };

    setToken(receivedToken);
    setUser(userData);
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return response.data;
  };

  // Register handler
  const register = async (name, email, password, role = 'user') => {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
