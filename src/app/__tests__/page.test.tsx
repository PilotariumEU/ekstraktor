import React from 'react';
import { render, screen } from '@testing-library/react';
import AeroLinkPage from '../page';

describe('AeroLinkPage', () => {
  it('renders the main heading', () => {
    render(<AeroLinkPage />);
    const heading = screen.getByRole('heading', {
      name: /ekstraktor\.pilotarium\.eu/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the textarea for input', () => {
    render(<AeroLinkPage />);
    const textarea = screen.getByPlaceholderText(/Wklej notatki tutaj/i);
    expect(textarea).toBeInTheDocument();
  });
});
