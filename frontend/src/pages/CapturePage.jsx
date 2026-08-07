import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { classifyImage } from '../services/api.js';
import CameraCapture from '../components/CameraCapture.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function CapturePage() {
  const navigate = useNavigate();
  const { session, setResult, isGuest } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  function handleCapture(file) {
    setSelectedFile(file);
    setError(null);
  }

  function handleCaptureError(err) {
    setError(err);
    setSelectedFile(null);
  }

  async function handleClassify() {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const result = await classifyImage(selectedFile, session.session_token);
      setResult(result);
      navigate('/result');
    } catch (err) {
      const status = err.response?.status;
      const code = err.response?.data?.code;

      if (!err.response) {
        setError({ code: 'NETWORK_ERROR', message: 'Error de red. Verifique su conexión.' });
      } else if (status === 401) {
        setError({ code: 'INVALID_SESSION', message: 'Sesión inválida.' });
      } else if (status === 413) {
        setError({ code: 'FILE_TOO_LARGE', message: 'Archivo demasiado grande (máx 5MB).' });
      } else if (status === 400) {
        setError({ code: code || 'INVALID_IMAGE', message: err.response.data?.error });
      } else if (status === 422) {
        setError({ code: code || 'LOW_CONFIDENCE', message: err.response.data?.error });
      } else if (status === 503) {
        setError({ code: 'AI_PROVIDER_ERROR', message: err.response.data?.error });
      } else {
        setError({ code: 'BACKEND_ERROR', message: err.response?.data?.error || err.message });
      }

      setLoading(false);
    }
  }

  function retry() {
    setError(null);
    setSelectedFile(null);
  }

  return (
    <div className="page">
      <h1 className="page-title">Clasificar residuo</h1>
      <p className="page-subtitle">
        {isGuest ? '👤 Invitado' : '🌟 Usuario identificado'}
      </p>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Clasificando imagen..." />
        ) : error ? (
          <ErrorMessage
            error={error.message}
            code={error.code}
            onRetry={retry}
            onGoHome={() => navigate('/')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CameraCapture
              onCapture={handleCapture}
              onError={handleCaptureError}
            />

            {selectedFile && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleClassify}
                disabled={loading}
              >
                ♻️ Clasificar residuo
              </button>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/summary')}
                style={{ flex: 1 }}
              >
                📋 Ver resumen
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{ flex: 1 }}
              >
                🏠 Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
