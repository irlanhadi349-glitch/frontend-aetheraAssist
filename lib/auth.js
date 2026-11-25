'use client';

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    if (!token || token === 'undefined' || token === 'null') {
      localStorage.removeItem('token');
      return;
    }
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
      return null;
    }
    return token;
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};