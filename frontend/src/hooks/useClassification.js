import { useState, useRef, useCallback } from 'react';
import { classifyWaste } from '../services/api';

export function useClassification() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const classify = useCallback(async (imageFile, customerId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    fileRef.current = imageFile;
    try {
      const data = await classifyWaste(imageFile, customerId);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al clasificar el residuo';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    fileRef.current = null;
  }, []);

  return { result, loading, error, classify, reset };
}
