import React from 'react';

const CONTAINER_CONFIG = {
  plastic: {
    container: 'blue',
    containerName: 'Contenedor Azul',
    label: 'Plástico',
    emoji: '🔵',
    cssClass: 'container-blue',
    color: '#1565c0'
  },
  glass: {
    container: 'green',
    containerName: 'Contenedor Verde',
    label: 'Vidrio',
    emoji: '🟢',
    cssClass: 'container-green',
    color: '#2e7d32'
  },
  paper: {
    container: 'yellow',
    containerName: 'Contenedor Amarillo',
    label: 'Papel/Cartón',
    emoji: '🟡',
    cssClass: 'container-yellow',
    color: '#f9a825'
  },
  metal: {
    container: 'gray',
    containerName: 'Contenedor Gris',
    label: 'Metal',
    emoji: '⚫',
    cssClass: 'container-gray',
    color: '#546e7a'
  },
  organic: {
    container: 'brown',
    containerName: 'Contenedor Marrón',
    label: 'Orgánico',
    emoji: '🟤',
    cssClass: 'container-brown',
    color: '#6d4c41'
  }
};

export function getContainerConfig(wasteType) {
  return CONTAINER_CONFIG[wasteType] || null;
}

export default function ContainerDisplay({ wasteType, size = 'large' }) {
  const config = getContainerConfig(wasteType);

  if (!config) {
    return (
      <div
        data-testid="container-unknown"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: size === 'large' ? 160 : 80,
          height: size === 'large' ? 160 : 80,
          borderRadius: '50%',
          background: '#bdbdbd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size === 'large' ? '3rem' : '1.5rem',
          color: 'white'
        }}>
          ❓
        </div>
        <span style={{ color: '#757575', fontWeight: 600 }}>Tipo desconocido</span>
      </div>
    );
  }

  const circleSize = size === 'large' ? 160 : 80;
  const fontSize = size === 'large' ? '4rem' : '2rem';
  const textSize = size === 'large' ? '1.1rem' : '0.85rem';

  return (
    <div
      data-testid={`container-${config.container}`}
      data-waste-type={wasteType}
      data-container={config.container}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div
        className={config.cssClass}
        data-waste-type={wasteType}
        data-container={config.container}
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          flexShrink: 0
        }}
      >
        {config.emoji}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: textSize, color: config.color }}>
          {config.label}
        </p>
        <p style={{ color: '#616161', fontSize: textSize }}>
          {config.containerName}
        </p>
      </div>
    </div>
  );
}
