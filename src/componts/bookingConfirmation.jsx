import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function BookingConfirmation() {
  const { state } = useLocation();

  return (
    <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-brand-700 to-emerald-500 px-8 py-10 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
              <span className="text-base">✓</span>
              Payment successful
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">Booking confirmed</h1>
            <p className="mt-2 text-white/90">
              We’ve sent a confirmation to your email/SMS (demo). You can review details below.
            </p>
          </div>

          <div className="px-8 py-8">
            {!state ? (
              <p className="text-slate-600">No booking details found. Please start a new booking.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</div>
                  <div className="mt-2 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Name:</span> {state.name}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Phone:</span> {state.phone}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trip</div>
                  <div className="mt-2 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Vehicle:</span> {state.vehicle}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Pickup:</span> {state.deliverLocation}
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold text-slate-900">Drop:</span> {state.returnLocation}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                  <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        ₹{state.total ?? state.price ?? 0}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/booking" className="btn-secondary">
                        New booking
                      </Link>
                      <Link to="/" className="btn-primary">
                        Back to home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

