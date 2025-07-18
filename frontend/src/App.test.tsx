import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fuckups board header', () => {
  render(<App />);
  const headerElement = screen.getByText(/fuckups board/i);
  expect(headerElement).toBeInTheDocument();
});
