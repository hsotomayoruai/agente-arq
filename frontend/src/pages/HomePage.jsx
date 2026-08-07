import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { createSession, getCustomerByQr } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGuest() {
    setLoading(true);
    setError(null);
    try {
      const data = await createSession();
      startSession(data.session, null);
      navigate('/capture');
    } catch (err) {
      setError({ code: 'BACKEND_ERROR', message: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleScanQR() {
    navigate('/scan');
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div className="logo">♻️</div>
        <h1 className="page-title">ReciclApp</h1>
        <p className="page-subtitle">Sistema de clasificación de residuos</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Iniciando sesión..." />
        ) : (
          <>
            <p style={{ textAlign: 'center', marginBottom: 24, color: '#616161' }}>
              Identifícate con tu código QR para ganar puntos, o continúa como invitado.
            </p>

            {error && (
              <ErrorMessage
                error={error.message}
                code={error.code}
                onRetry={() => setError(null)}
              />
            )}

            {!error && (
              <div className="btn-group">
                <button className="btn btn-primary btn-lg" onClick={handleScanQR}>
                  📷 Escanear código QR
                </button>
                <button className="btn btn-secondary btn-lg" onClick={handleGuest}>
                  👤 No tengo cuenta (invitado)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <p style={{ color: '#9e9e9e', fontSize: '0.85rem' }}>
          Tablet de clasificación de residuos — Centro de Reciclaje
        </p>
      </div>
    </div>
  );
}
