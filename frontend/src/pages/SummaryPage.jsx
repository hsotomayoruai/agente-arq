import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { getSessionSummary } from '../services/api.js';
import SessionSummary from '../components/SessionSummary.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function SummaryPage() {
  const navigate = useNavigate();
  const { session, clearSession } = useSession();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }
    fetchSummary();
  }, [session]);

  async function fetchSummary() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionSummary(session.session_token);
      setSummary(data);
    } catch (err) {
      setError({ code: 'BACKEND_ERROR', message: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleFinish() {
    clearSession();
    navigate('/');
  }

  return (
    <div className="page">
      <h1 className="page-title">📋 Resumen de sesión</h1>
      <p className="page-subtitle">Todo lo clasificado en esta sesión</p>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Cargando resumen..." />
        ) : error ? (
          <ErrorMessage
            error={error.message}
            code={error.code}
            onRetry={fetchSummary}
            onGoHome={handleFinish}
          />
        ) : (
          <SessionSummary
            summary={summary}
            onClassifyAnother={() => navigate('/capture')}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
