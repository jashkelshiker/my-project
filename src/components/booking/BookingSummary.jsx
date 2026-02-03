import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateReadable } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Booking Summary Component
 * Displays booking details before payment
 */
export default function BookingSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="py-12">
        <div className="container-page">
          <Card className="mx-auto max-w-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              No booking data found
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Please start a new booking
            </p>
            <Button onClick={() => navigate('/booking')}>Start Booking</Button>
          </Card>
        </div>
      </div>
    );
  }

  const {
    name,
    phone,
    age,
    licenseNumber,
    vehicle,
    persons,
    deliverLocation,
    returnLocation,
    deliverDate,
    returnDate,
    price,
    days,
    subtotal,
    tax,
    total,
  } = state;

  const finalTotal = total || (subtotal + tax);

  return (
    <div className="py-12">
      <div className="container-page">
        <Card className="mx-auto max-w-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Booking Summary
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Review your booking details before proceeding to payment
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card variant="slate" className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer Details
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-900">Name:</span>{' '}
                  {name}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Phone:</span>{' '}
                  {phone}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Age:</span> {age}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">License:</span>{' '}
                  {licenseNumber}
                </div>
              </div>
            </Card>

            <Card variant="slate" className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trip Details
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-900">Vehicle:</span>{' '}
                  {vehicle}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Persons:</span>{' '}
                  {persons}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Pickup:</span>{' '}
                  {deliverLocation}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Drop:</span>{' '}
                  {returnLocation}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Dates:</span>{' '}
                  {formatDateReadable(deliverDate)} to{' '}
                  {formatDateReadable(returnDate)}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Duration:</span>{' '}
                  {days || 'N/A'} day{(days || 1) > 1 ? 's' : ''}
                </div>
              </div>
            </Card>
          </div>

          <Card variant="brand" className="mt-6 p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Price per day</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(price || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Days</span>
                <span className="font-medium text-slate-900">{days || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(tax || 0)}
                </span>
              </div>
              <div className="border-t border-brand-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-brand-900">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </Card>

          <div className="mt-8 flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/booking')}
            >
              ← Edit Booking
            </Button>
            <Button
              fullWidth
              onClick={() =>
                navigate('/payment', {
                  state: { ...state, totalPrice: finalTotal, days, tax },
                })
              }
            >
              Proceed to Payment →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
