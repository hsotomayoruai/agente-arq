import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ContainerDisplay, { getContainerConfig } from '../components/ContainerDisplay.jsx';

describe('ContainerDisplay', () => {
  test('shows blue container for plastic', () => {
    render(<ContainerDisplay wasteType="plastic" />);
    const el = screen.getByTestId('container-blue');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-waste-type', 'plastic');
  });

  test('shows green container for glass', () => {
    render(<ContainerDisplay wasteType="glass" />);
    const el = screen.getByTestId('container-green');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-waste-type', 'glass');
  });

  test('shows yellow container for paper', () => {
    render(<ContainerDisplay wasteType="paper" />);
    const el = screen.getByTestId('container-yellow');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-waste-type', 'paper');
  });

  test('shows gray container for metal', () => {
    render(<ContainerDisplay wasteType="metal" />);
    const el = screen.getByTestId('container-gray');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-waste-type', 'metal');
  });

  test('shows brown container for organic', () => {
    render(<ContainerDisplay wasteType="organic" />);
    const el = screen.getByTestId('container-brown');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-waste-type', 'organic');
  });

  test('shows unknown state for unrecognized waste type', () => {
    render(<ContainerDisplay wasteType="nuclear" />);
    const el = screen.getByTestId('container-unknown');
    expect(el).toBeInTheDocument();
  });

  test('getContainerConfig returns correct data for plastic', () => {
    const config = getContainerConfig('plastic');
    expect(config).not.toBeNull();
    expect(config.container).toBe('blue');
    expect(config.label).toBe('Plástico');
    expect(config.emoji).toBe('🔵');
  });

  test('getContainerConfig returns correct data for glass', () => {
    const config = getContainerConfig('glass');
    expect(config.container).toBe('green');
    expect(config.label).toBe('Vidrio');
  });

  test('getContainerConfig returns null for unknown type', () => {
    const config = getContainerConfig('unknown');
    expect(config).toBeNull();
  });

  test('shows container name text', () => {
    render(<ContainerDisplay wasteType="plastic" />);
    expect(screen.getByText('Contenedor Azul')).toBeInTheDocument();
    expect(screen.getByText('Plástico')).toBeInTheDocument();
  });

  test('shows correct text for metal container', () => {
    render(<ContainerDisplay wasteType="metal" />);
    expect(screen.getByText('Contenedor Gris')).toBeInTheDocument();
    expect(screen.getByText('Metal')).toBeInTheDocument();
  });
});
