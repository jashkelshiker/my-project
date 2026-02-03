import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehicleRentalSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="py-12">
        <div className="container-page">
          <div className="card mx-auto max-w-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">No booking data found</h2>
            <p className="text-sm text-slate-600 mb-6">Please start a new booking</p>
            <button onClick={() => navigate("/booking")} className="btn-primary">
              Start Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = Math.ceil((new Date(state.returnDate) - new Date(state.deliverDate)) / (1000 * 60 * 60 * 24));
  const totalPrice = state.price * days;
  const tax = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + tax;

  return (
    <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Booking Summary</h2>
            <p className="mt-2 text-sm text-slate-600">Review your booking details before proceeding to payment</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer Details</div>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="font-semibold text-slate-900">Name:</span> {state.name}</div>
                <div><span className="font-semibold text-slate-900">Phone:</span> {state.phone}</div>
                <div><span className="font-semibold text-slate-900">Age:</span> {state.age}</div>
                <div><span className="font-semibold text-slate-900">License:</span> {state.licenseNumber}</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trip Details</div>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="font-semibold text-slate-900">Vehicle:</span> {state.vehicle}</div>
                <div><span className="font-semibold text-slate-900">Persons:</span> {state.persons}</div>
                <div><span className="font-semibold text-slate-900">Pickup:</span> {state.deliverLocation}</div>
                <div><span className="font-semibold text-slate-900">Drop:</span> {state.returnLocation}</div>
                <div><span className="font-semibold text-slate-900">Dates:</span> {state.deliverDate} to {state.returnDate}</div>
                <div><span className="font-semibold text-slate-900">Duration:</span> {days} day{days > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Price per day</span>
                <span className="font-medium text-slate-900">₹{state.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Days</span>
                <span className="font-medium text-slate-900">{days}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-900">₹{tax}</span>
              </div>
              <div className="border-t border-brand-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-brand-900">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={() => navigate("/booking")} className="btn-secondary flex-1">
              ← Edit Booking
            </button>
            <button
              onClick={() => navigate("/payment", { state: { ...state, totalPrice: finalTotal, days, tax } })}
              className="btn-primary flex-1"
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
