import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ClassificationResult from '../components/ClassificationResult.jsx';

const baseResult = {
  waste_type: 'plastic',
  confidence: 0.92,
  container: 'blue',
  containerName: 'Contenedor Azul',
  label: 'Plástico',
  emoji: '🔵',
  points_awarded: 10,
  customer: {
    id: 1,
    name: 'Ana López',
    total_points: 50
  }
};

describe('ClassificationResult', () => {
  test('renders nothing when result is null', () => {
    const { container } = render(<ClassificationResult result={null} isGuest={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('shows points for identified customer', () => {
    render(<ClassificationResult result={baseResult} isGuest={false} />);
    expect(screen.getByTestId('points-display')).toBeInTheDocument();
    expect(screen.getByText('+10')).toBeInTheDocument();
  });

  test('shows customer total points for identified customer', () => {
    render(<ClassificationResult result={baseResult} isGuest={false} />);
    expect(screen.getByText('Total: 50 puntos')).toBeInTheDocument();
  });

  test('does NOT show points display for guest user', () => {
    render(<ClassificationResult result={baseResult} isGuest={true} />);
    expect(screen.queryByTestId('points-display')).not.toBeInTheDocument();
  });

  test('shows guest message when isGuest is true', () => {
    render(<ClassificationResult result={baseResult} isGuest={true} />);
    expect(screen.getByTestId('guest-no-points')).toBeInTheDocument();
  });

  test('does NOT show guest message for identified customer', () => {
    render(<ClassificationResult result={baseResult} isGuest={false} />);
    expect(screen.queryByTestId('guest-no-points')).not.toBeInTheDocument();
  });

  test('shows confidence percentage', () => {
    render(<ClassificationResult result={baseResult} isGuest={false} />);
    expect(screen.getByText('Confianza: 92%')).toBeInTheDocument();
  });

  test('shows container display', () => {
    render(<ClassificationResult result={baseResult} isGuest={false} />);
    expect(screen.getByTestId('container-blue')).toBeInTheDocument();
  });

  test('does not show points when points_awarded is 0 even for identified customer', () => {
    const resultZeroPoints = { ...baseResult, points_awarded: 0 };
    render(<ClassificationResult result={resultZeroPoints} isGuest={false} />);
    expect(screen.queryByTestId('points-display')).not.toBeInTheDocument();
  });

  test('renders result for organic waste', () => {
    const organicResult = {
      ...baseResult,
      waste_type: 'organic',
      container: 'brown',
      containerName: 'Contenedor Marrón',
      label: 'Orgánico',
      emoji: '🟤',
      points_awarded: 5,
      customer: { id: 1, name: 'Test', total_points: 5 }
    };
    render(<ClassificationResult result={organicResult} isGuest={false} />);
    expect(screen.getByTestId('container-brown')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });
});
