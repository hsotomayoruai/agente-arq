import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import ClassificationResult from '../components/ClassificationResult.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function ResultPage() {
  const navigate = useNavigate();
  const { session, lastResult, isGuest } = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  if (!lastResult) {
    return (
      <div className="page">
        <div className="card">
          <ErrorMessage
            error="No hay resultado disponible."
            code="GENERIC"
            onRetry={() => navigate('/capture')}
            onGoHome={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">✅ Clasificación exitosa</h1>
      <p className="page-subtitle">Deposita el residuo en el contenedor indicado</p>

      <div className="card">
        <ClassificationResult result={lastResult} isGuest={isGuest} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/capture')}
          >
            ♻️ Clasificar otro residuo
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('/summary')}
            style={{ width: '100%' }}
          >
            📋 Ver resumen de sesión
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ width: '100%' }}
          >
            🏠 Finalizar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
