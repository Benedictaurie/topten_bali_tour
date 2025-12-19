// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tambah ini

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser) {
          setUser(parsedUser);
          setIsAuthenticated(true); // Set true jika ada user
          
          // Cek verifikasi email
          const isVerified = 
            parsedUser.email_verified_at || 
            parsedUser.email_verified === true;
          setNeedsVerification(!isVerified);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    } else {
      setIsAuthenticated(false); // Set false jika tidak ada user
    }
    setLoading(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setNeedsVerification(false);
  };

  const login = (userData, token, emailVerified = false) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true); // Set true saat login
    setNeedsVerification(!emailVerified);
  };

  const verifyEmail = () => {
    const updatedUser = { ...user, email_verified_at: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setNeedsVerification(false);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await fetch('http://localhost:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthData(); // Gunakan fungsi clearAuthData
    }
  };

  // Helper functions
  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isEmailVerified = () => !needsVerification;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated, // Export isAuthenticated
      login,
      logout,
      verifyEmail,
      isAdmin,
      isUser,
      isEmailVerified,
      needsVerification,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};