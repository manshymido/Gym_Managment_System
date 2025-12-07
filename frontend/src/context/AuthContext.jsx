import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, token, type) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', type);
      setUser(userData);
      setUserType(type);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('فشل حفظ بيانات المستخدم');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    userType,
    login,
    logout,
    loading
  }), [user, userType, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

