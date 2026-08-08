import { useState, useCallback } from 'react';
import { findCustomerByQr } from '../services/api';

export function useCustomer() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginByQr = useCallback(async (qrCode) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findCustomerByQr(qrCode);
      setCustomer(data);
      return data;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? 'Código QR no reconocido'
          : 'Error al identificar cliente';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    setError(null);
  }, []);

  const updatePoints = useCallback((newPoints) => {
    setCustomer((prev) => prev ? { ...prev, points: newPoints } : prev);
  }, []);

  return { customer, loading, error, loginByQr, logout, updatePoints };
}
