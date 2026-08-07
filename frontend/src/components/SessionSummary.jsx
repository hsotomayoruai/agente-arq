import React from 'react';
import ContainerDisplay from './ContainerDisplay.jsx';

export default function SessionSummary({ summary, onClassifyAnother, onFinish }) {
  if (!summary) return null;

  const { session, customer, classifications, totalPoints } = summary;

  return (
    <div data-testid="session-summary" style={{ width: '100%' }}>
      <div style={{
        background: '#e8f5e9',
        borderRadius: 12,
        padding: '20px',
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <p style={{ color: '#2e7d32', fontWeight: 600, fontSize: '1rem' }}>
          {customer ? `👤 ${customer.name}` : '👤 Invitado'}
        </p>
        <p style={{ color: '#757575', fontSize: '0.9rem', marginTop: 4 }}>
          {classifications.length} clasificación{classifications.length !== 1 ? 'es' : ''} en esta sesión
        </p>
        {customer && (
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1b5e20', marginTop: 8 }}>
            +{totalPoints} puntos ganados
          </p>
        )}
      </div>

      {classifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#757575' }}>
          No hay clasificaciones en esta sesión aún.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {classifications.map((c, i) => (
            <div
              key={c.id}
              data-testid={`classification-item-${i}`}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16
              }}
            >
              <ContainerDisplay wasteType={c.waste_type} size="small" />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.waste_type}</p>
                <p style={{ color: '#757575', fontSize: '0.85rem' }}>
                  Confianza: {Math.round(c.confidence * 100)}%
                </p>
              </div>
              {c.points_awarded > 0 && (
                <span style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.9rem'
                }}>
                  +{c.points_awarded} pts
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        {onClassifyAnother && (
          <button
            onClick={onClassifyAnother}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ♻️ Clasificar otro residuo
          </button>
        )}
        {onFinish && (
          <button
            onClick={onFinish}
            style={{
              background: '#f5f5f5',
              border: '1px solid #bdbdbd',
              borderRadius: 12,
              padding: '12px 28px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            🏠 Finalizar sesión
          </button>
        )}
      </div>
    </div>
  );
}
