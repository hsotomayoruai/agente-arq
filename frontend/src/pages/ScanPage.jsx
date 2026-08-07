import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { createSession, getCustomerByQr } from '../services/api.js';
import QRScanner from '../components/QRScanner.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function ScanPage() {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannerError, setScannerError] = useState(null);

  async function handleScan(qrData) {
    setLoading(true);
    setError(null);

    try {
      // Verify the QR token resolves to a customer
      await getCustomerByQr(qrData);
      // Create identified session
      const data = await createSession(qrData);
      startSession(data.session, data.session.customer_id ? { qr_token: qrData } : null);
      navigate('/capture');
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError({ code: 'INVALID_SESSION', message: 'QR no reconocido. El cliente no existe.' });
      } else {
        setError({ code: 'BACKEND_ERROR', message: err.response?.data?.error || err.message });
      }
      setLoading(false);
    }
  }

  function handleScannerError(err) {
    setScannerError(err);
  }

  function handleGoHome() {
    navigate('/');
  }

  function retry() {
    setError(null);
    setScannerError(null);
  }

  return (
    <div className="page">
      <h1 className="page-title">Escanear código QR</h1>
      <p className="page-subtitle">Apunta la cámara a tu código QR personal</p>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Identificando cliente..." />
        ) : error ? (
          <ErrorMessage
            error={error.message}
            code={error.code}
            onRetry={retry}
            onGoHome={handleGoHome}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <QRScanner onScan={handleScan} onError={handleScannerError} />

            {scannerError && (
              <ErrorMessage
                error={scannerError.message}
                code={scannerError.code}
                onGoHome={handleGoHome}
              />
            )}

            <button
              className="btn btn-secondary"
              onClick={handleGoHome}
              style={{ width: '100%' }}
            >
              ← Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
