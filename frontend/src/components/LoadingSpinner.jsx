import React from 'react';

export default function LoadingSpinner({ message = 'Procesando...' }) {
  return (
    <div
      data-testid="loading-spinner"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '32px'
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        border: '6px solid #e8f5e9',
        borderTop: '6px solid #2e7d32',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#2e7d32', fontWeight: 600, fontSize: '1.1rem' }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
