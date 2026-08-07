import React from 'react';
import ContainerDisplay from './ContainerDisplay.jsx';

export default function ClassificationResult({ result, isGuest }) {
  if (!result) return null;

  const { waste_type, confidence, label, containerName, points_awarded, customer } = result;
  const showPoints = !isGuest && points_awarded > 0;

  return (
    <div
      data-testid="classification-result"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '24px 0'
      }}
    >
      <ContainerDisplay wasteType={waste_type} size="large" />

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#757575', fontSize: '0.9rem' }}>
          Confianza: {Math.round(confidence * 100)}%
        </p>
      </div>

      {showPoints && (
        <div
          data-testid="points-display"
          style={{
            background: '#e8f5e9',
            border: '2px solid #4caf50',
            borderRadius: '12px',
            padding: '16px 32px',
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '0.9rem', color: '#2e7d32', marginBottom: 4 }}>
            Puntos obtenidos
          </p>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1b5e20' }}>
            +{points_awarded}
          </p>
          {customer && (
            <p style={{ fontSize: '0.85rem', color: '#388e3c' }}>
              Total: {customer.total_points} puntos
            </p>
          )}
        </div>
      )}

      {isGuest && (
        <div
          data-testid="guest-no-points"
          style={{
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '12px 24px',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#757575', fontSize: '0.9rem' }}>
            🚫 Los invitados no acumulan puntos.{' '}
            <span style={{ color: '#2e7d32' }}>¡Crea una cuenta para ganarlos!</span>
          </p>
        </div>
      )}
    </div>
  );
}
