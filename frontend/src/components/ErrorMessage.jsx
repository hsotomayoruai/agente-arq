import React from 'react';

const ERROR_MESSAGES = {
  CAMERA_UNAVAILABLE: 'La cámara no está disponible en este dispositivo.',
  CAMERA_PERMISSION_DENIED: 'Permiso de cámara denegado. Por favor, habilítelo en la configuración.',
  INVALID_IMAGE: 'El archivo seleccionado no es una imagen válida.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.',
  NETWORK_ERROR: 'Error de red. Verifique su conexión a internet.',
  BACKEND_ERROR: 'Error del servidor. Intente nuevamente.',
  AI_PROVIDER_ERROR: 'Error al procesar la imagen. Intente con otra foto.',
  UNKNOWN_CLASSIFICATION: 'No se pudo identificar el tipo de residuo.',
  LOW_CONFIDENCE: 'La clasificación tiene un nivel de confianza insuficiente. Intente con una foto más clara.',
  INVALID_SESSION: 'La sesión ha expirado. Por favor, inicie una nueva sesión.',
  INVALID_FORMAT: 'Formato de imagen no soportado. Use JPEG, PNG o WEBP.',
  NO_IMAGE: 'No se proporcionó ninguna imagen.',
  GENERIC: 'Ha ocurrido un error inesperado. Intente nuevamente.'
};

export function getErrorMessage(code, fallback) {
  return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES.GENERIC;
}

export default function ErrorMessage({ error, code, onRetry, onGoHome }) {
  const message = getErrorMessage(code, typeof error === 'string' ? error : error?.message);

  return (
    <div
      data-testid="error-message"
      style={{
        background: '#ffebee',
        border: '2px solid #ef9a9a',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        width: '100%'
      }}
    >
      <p style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</p>
      <p
        data-testid="error-text"
        style={{
          color: '#c62828',
          fontWeight: 600,
          fontSize: '1rem',
          marginBottom: '20px'
        }}
      >
        {message}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {onRetry && (
          <button
            data-testid="retry-button"
            onClick={onRetry}
            style={{
              background: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            🔄 Reintentar
          </button>
        )}

        {onGoHome && (
          <button
            data-testid="go-home-button"
            onClick={onGoHome}
            style={{
              background: 'transparent',
              color: '#616161',
              border: '1px solid #bdbdbd',
              borderRadius: '10px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            🏠 Ir al inicio
          </button>
        )}
      </div>
    </div>
  );
}
