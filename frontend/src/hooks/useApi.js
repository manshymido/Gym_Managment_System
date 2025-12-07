import { useState, useCallback } from 'react';

/**
 * Custom hook لإدارة API calls مع loading و error states
 * @param {Function} apiFunction - دالة API للتنفيذ
 * @returns {Object} { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

