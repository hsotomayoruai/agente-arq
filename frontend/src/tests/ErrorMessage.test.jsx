import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ErrorMessage, { getErrorMessage } from '../components/ErrorMessage.jsx';

describe('ErrorMessage', () => {
  test('renders the error message', () => {
    render(<ErrorMessage error="Test error message" onRetry={() => {}} />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-text')).toBeInTheDocument();
  });

  test('shows retry button when onRetry is provided', () => {
    render(<ErrorMessage error="Some error" onRetry={() => {}} />);
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  test('does NOT show retry button when onRetry is not provided', () => {
    render(<ErrorMessage error="Some error" />);
    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage error="Some error" onRetry={onRetry} />);
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('shows go-home button when onGoHome is provided', () => {
    render(<ErrorMessage error="Some error" onGoHome={() => {}} />);
    expect(screen.getByTestId('go-home-button')).toBeInTheDocument();
  });

  test('calls onGoHome when go-home button is clicked', () => {
    const onGoHome = vi.fn();
    render(<ErrorMessage error="Some error" onGoHome={onGoHome} />);
    fireEvent.click(screen.getByTestId('go-home-button'));
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  test('shows correct message for CAMERA_UNAVAILABLE code', () => {
    render(<ErrorMessage code="CAMERA_UNAVAILABLE" />);
    expect(screen.getByTestId('error-text').textContent).toContain('cámara no está disponible');
  });

  test('shows correct message for CAMERA_PERMISSION_DENIED code', () => {
    render(<ErrorMessage code="CAMERA_PERMISSION_DENIED" />);
    expect(screen.getByTestId('error-text').textContent).toContain('Permiso de cámara');
  });

  test('shows correct message for FILE_TOO_LARGE code', () => {
    render(<ErrorMessage code="FILE_TOO_LARGE" />);
    expect(screen.getByTestId('error-text').textContent).toContain('demasiado grande');
  });

  test('shows correct message for NETWORK_ERROR code', () => {
    render(<ErrorMessage code="NETWORK_ERROR" />);
    expect(screen.getByTestId('error-text').textContent).toContain('Error de red');
  });

  test('shows correct message for INVALID_SESSION code', () => {
    render(<ErrorMessage code="INVALID_SESSION" />);
    expect(screen.getByTestId('error-text').textContent).toContain('sesión ha expirado');
  });

  test('shows correct message for LOW_CONFIDENCE code', () => {
    render(<ErrorMessage code="LOW_CONFIDENCE" />);
    expect(screen.getByTestId('error-text').textContent).toContain('confianza insuficiente');
  });

  test('uses fallback error message string when no code matches', () => {
    render(<ErrorMessage error="Mi mensaje personalizado" code="NONEXISTENT_CODE" />);
    expect(screen.getByTestId('error-text').textContent).toContain('Mi mensaje personalizado');
  });

  test('getErrorMessage returns correct messages', () => {
    expect(getErrorMessage('NETWORK_ERROR')).toContain('Error de red');
    expect(getErrorMessage('FILE_TOO_LARGE')).toContain('demasiado grande');
    expect(getErrorMessage('INVALID_SESSION')).toContain('sesión');
    expect(getErrorMessage('UNKNOWN_CODE', 'fallback msg')).toBe('fallback msg');
  });

  test('both retry and go-home buttons can be present simultaneously', () => {
    render(<ErrorMessage error="Error" onRetry={() => {}} onGoHome={() => {}} />);
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('go-home-button')).toBeInTheDocument();
  });
});
