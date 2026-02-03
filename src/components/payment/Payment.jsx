import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addBooking } from '../../data/mockData';
import { PAYMENT_METHODS } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * Payment Component
 * Handles payment method selection and booking confirmation
 */
export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [method, setMethod] = useState(PAYMENT_METHODS.UPI);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="py-12">
        <div className="container-page">
          <Card className="mx-auto max-w-md p-8 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              No booking data found
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Please complete booking first
            </p>
            <Button onClick={() => navigate('/booking')}>Start Booking</Button>
          </Card>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

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

      navigate('/booking-confirmation', {
        state: {
          ...bookingData,
          total: bookingData.totalPrice,
          paymentMethod: method,
        },
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const subtotal = bookingData.totalPrice - (bookingData.tax || 0);
  const paymentMethods = [
    {
      value: PAYMENT_METHODS.UPI,
      label: 'UPI',
      description: 'Pay via UPI apps',
    },
    {
      value: PAYMENT_METHODS.CARD,
      label: 'Debit / Credit Card',
      description: 'Visa, Mastercard, RuPay',
    },
    {
      value: PAYMENT_METHODS.CASH,
      label: 'Cash',
      description: 'Pay on pickup',
    },
  ];

  return (
    <div className="py-12">
      <div className="container-page">
        <Card className="mx-auto max-w-md p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Payment
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Complete your booking with secure payment
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Amount Summary */}
          <Card variant="slate" className="p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(bookingData.tax || 0)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-brand-900">
                  {formatPrice(bookingData.totalPrice)}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="label mb-3">Select Payment Method</label>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.value}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    method === pm.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={pm.value}
                    checked={method === pm.value}
                    onChange={(e) => setMethod(e.target.value)}
                    className="h-4 w-4 text-brand-600"
                  />
                  <div>
                    <div className="font-medium text-slate-900">{pm.label}</div>
                    <div className="text-xs text-slate-600">{pm.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            fullWidth
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(bookingData.totalPrice)} Now`}
          </Button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Your payment is secure and encrypted
          </p>
        </Card>
      </div>
    </div>
  );
}
