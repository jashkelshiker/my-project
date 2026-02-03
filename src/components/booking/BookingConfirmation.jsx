import React from 'react';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/priceUtils';
import { formatDateReadable } from '../../utils/dateUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Booking Confirmation Component
 * Displays successful booking confirmation
 */
export default function BookingConfirmation() {
  const { state } = useLocation();

  return (
    <div className="py-12">
      <div className="container-page">
        <Card className="mx-auto max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-brand-700 to-emerald-500 px-8 py-10 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
              <span className="text-base">✓</span>
              Payment successful
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
              Booking confirmed
            </h1>
            <p className="mt-2 text-white/90">
              We've sent a confirmation to your email/SMS (demo). You can review
              details below.
            </p>
          </div>

          <div className="px-8 py-8">
            {!state ? (
              <p className="text-slate-600">
                No booking details found. Please start a new booking.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card variant="slate" className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Name:</span>{' '}
                      {state.name}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Phone:</span>{' '}
                      {state.phone}
                    </div>
                    {state.paymentMethod && (
                      <div className="mt-1">
                        <span className="font-semibold text-slate-900">
                          Payment:
                        </span>{' '}
                        {state.paymentMethod.toUpperCase()}
                      </div>
                    )}
                  </div>
                </Card>

                <Card variant="slate" className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Trip
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Vehicle:</span>{' '}
                      {state.vehicle}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Pickup:</span>{' '}
                      {state.deliverLocation}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Drop:</span>{' '}
                      {state.returnLocation}
                    </div>
                    {state.deliverDate && state.returnDate && (
                      <div className="mt-1">
                        <span className="font-semibold text-slate-900">Dates:</span>{' '}
                        {formatDateReadable(state.deliverDate)} to{' '}
                        {formatDateReadable(state.returnDate)}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4 md:col-span-2">
                  <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        {formatPrice(state.total ?? state.price ?? 0)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => (window.location.href = '/booking')}>
                        New booking
                      </Button>
                      <Button onClick={() => (window.location.href = '/')}>
                        Back to home
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
