import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';
import { MemoryRouter } from 'react-router-dom';

// We mock some elements because App has router dependencies
// Wait, App itself defines Router (BrowserRouter).
// If we render App it will use BrowserRouter.

describe('Application Initial Rendering', () => {
  it('renders landing page or login view on load', () => {
    // If we just render App, it might show Landing or login
    render(<App />);
    // Check if Sehati AI (app name) is rendered somewhere
    expect(screen.queryAllByText(/Sehati AI/i).length).toBeGreaterThan(0);
  });
});
