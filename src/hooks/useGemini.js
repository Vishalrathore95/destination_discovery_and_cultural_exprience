import { useState, useCallback } from 'react';

export const useGemini = (apiCallback) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCallback(...args);
      if (response && response.error) {
        throw new Error(response.error);
      }
      setData(response);
      return response;
    } catch (err) {
      const errMsg = err.message || 'Failed to generate content. Please try again.';
      setError(errMsg);
      return { error: errMsg };
    } finally {
      setLoading(false);
    }
  }, [apiCallback]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
};
