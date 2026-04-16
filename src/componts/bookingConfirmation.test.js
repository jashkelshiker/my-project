import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookingConfirmation from './bookingConfirmation';

// helper to render component with router state
function renderWithRouter(initialState) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/booking-confirmation', state: initialState }]}> 
      <Routes>
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BookingConfirmation component', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders booking details when location state is provided', () => {
    const fake = {
      name: 'Alice',
      phone: '9998887777',
      vehicle: 'SUV',
      deliverLocation: 'CityA',
      returnLocation: 'CityB',
      price: 2000,
      deliverDate: '2025-01-01',
      returnDate: '2025-01-03',
      total: 4400,
    };

    renderWithRouter(fake);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/CityA/)).toBeInTheDocument();
    expect(screen.getByText(/₹4400/)).toBeInTheDocument();
  });

  it('falls back to sessionStorage when no state is present', () => {
    const fake = {
      name: 'Bob',
      phone: '1234567890',
      vehicle: 'Sedan',
      deliverLocation: 'X',
      returnLocation: 'Y',
      price: 1500,
      deliverDate: '2025-02-01',
      returnDate: '2025-02-02',
    };
    sessionStorage.setItem('bookingData', JSON.stringify(fake));

    renderWithRouter(null);
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
    // compute 1 day * 1500 = 1500 + tax = 1760
    expect(screen.getByText(/₹1760/)).toBeInTheDocument();
  });
});
