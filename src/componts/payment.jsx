import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addBooking } from "../data/mockData";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [method, setMethod] = useState("upi");
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="py-12">
        <div className="container-page">
          <div className="card mx-auto max-w-md p-8 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">No booking data found</h2>
            <p className="text-sm text-slate-600 mb-6">Please complete booking first</p>
            <button onClick={() => navigate("/booking")} className="btn-primary">
              Start Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      // Save booking
      await addBooking({
        userId: user?.id || Date.now(),
        userName: bookingData.name,
        vehicleId: Date.now(),
        vehicleName: bookingData.vehicle,
        pickupDate: bookingData.deliverDate,
        returnDate: bookingData.returnDate,
        pickupLocation: bookingData.deliverLocation,
        dropLocation: bookingData.returnLocation,
        totalPrice: bookingData.totalPrice,
        status: 'confirmed',
      });

      navigate("/booking-confirmation", {
        state: {
          ...bookingData,
          total: bookingData.totalPrice,
          paymentMethod: method,
        },
      });
    } catch (error) {
      alert("Payment failed. Please try again.");
    }
  };

  const subtotal = bookingData.totalPrice - (bookingData.tax || 0);

  return (
    <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-md p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Payment</h2>
            <p className="mt-2 text-sm text-slate-600">Complete your booking with secure payment</p>
          </div>

          {/* Amount Summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-900">₹{bookingData.tax || 0}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-brand-900">₹{bookingData.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="label mb-3">Select Payment Method</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  value="upi"
                  checked={method === "upi"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="h-4 w-4 text-brand-600"
                />
                <div>
                  <div className="font-medium text-slate-900">UPI</div>
                  <div className="text-xs text-slate-600">Pay via UPI apps</div>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  value="card"
                  checked={method === "card"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="h-4 w-4 text-brand-600"
                />
                <div>
                  <div className="font-medium text-slate-900">Debit / Credit Card</div>
                  <div className="text-xs text-slate-600">Visa, Mastercard, RuPay</div>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  value="cash"
                  checked={method === "cash"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="h-4 w-4 text-brand-600"
                />
                <div>
                  <div className="font-medium text-slate-900">Cash</div>
                  <div className="text-xs text-slate-600">Pay on pickup</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pay Button */}
          <button onClick={handlePayment} className="btn-primary w-full">
            Pay ₹{bookingData.totalPrice} Now
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
