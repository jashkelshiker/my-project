import React from "react";
import { Link, useLocation } from "react-router-dom";
import Preloader from "../components/common/Preloader";

export default function BookingConfirmation() {
  const { state } = useLocation();
  const [booking, setBooking] = React.useState(state);

  // sync with sessionStorage / fallback when no location state
  React.useEffect(() => {
    if (state) {
      setBooking(state);
      try {
        sessionStorage.setItem('bookingData', JSON.stringify(state));
      } catch (e) {
        console.warn('unable to cache booking state', e);
      }
    } else {
      const stored = sessionStorage.getItem('bookingData');
      if (stored) {
        try {
          setBooking(JSON.parse(stored));
        } catch {}
      }
    }
  }, [state]);

  // calculate derived amounts when we only have raw booking info
  const [isLoading, setIsLoading] = React.useState(true);

  // simulate loading time for a smooth UX
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const days = booking && booking.deliverDate && booking.returnDate
    ? Math.ceil((new Date(booking.returnDate) - new Date(booking.deliverDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const pricePerDay = booking?.price ?? 0;
  const subtotal = pricePerDay * days;
  const tax = booking?.tax ?? Math.round(subtotal * 0.17);
  const computedTotal = subtotal + tax;
  const displayTotal = booking?.totalPrice ?? booking?.total ?? computedTotal;
  const paymentMethod = booking?.paymentMethod ?? 'Not specified';
  const bookingId = booking?.bookingId || booking?.id || 'N/A';

  const downloadSummaryPdf = () => {
    if (!booking) return;
    const days = booking && booking.deliverDate && booking.returnDate
      ? Math.ceil((new Date(booking.returnDate) - new Date(booking.deliverDate)) / (1000 * 60 * 60 * 24))
      : 0;
    const pricePerDay = booking?.price ?? 0;
    const subtotal = pricePerDay * days;
    const tax = booking?.tax ?? Math.round(subtotal * 0.17);
    const totalAmt = booking?.totalPrice ?? booking?.total ?? subtotal + tax;
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageHeight = doc.internal.pageSize.height;
      let y = 40;

      doc.setFontSize(18);
      doc.setFont('helvetica','bold');
      doc.text('Booking Confirmation', 40, y);
      y += 20;
      doc.line(40, y, 555, y);
      y += 20;

      doc.setFontSize(12);
      const lines = [
        `Booking ID: ${bookingId}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Age: ${booking.age ?? 'N/A'}`,
        `License: ${booking.licenseNumber ?? 'N/A'}`,
        `Vehicle: ${booking.vehicle}`,
        `Persons: ${booking.persons ?? 'N/A'}`,
        `Pickup: ${booking.deliverLocation}`,
        `Drop: ${booking.returnLocation}`,
        `Dates: ${booking.deliverDate} to ${booking.returnDate}`,
        `Duration: ${days} day${days === 1 ? '' : 's'}`,
        `Price per day: Rs. ${pricePerDay}`,
        `Subtotal: Rs. ${subtotal}`,
        `Tax (17%): Rs. ${tax}`,
        `Total: Rs. ${totalAmt}`,
        `Payment Method: ${paymentMethod}`,
      ];
      lines.forEach(line => {
        if (y > pageHeight - 60) { doc.addPage(); y = 40; }
        doc.text(line, 40, y); y += 18;
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i =1;i<=pageCount;i++){
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 300, pageHeight-30, null,null,'center');
      }

      doc.save('booking-confirmation.pdf');
    });
  };

  return (
    <>
      <Preloader isVisible={isLoading} message="Loading your confirmation..." />
      <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-brand-700 to-emerald-500 px-8 py-10 text-black">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
              <span className="text-base">✓</span>
              Payment successful
            </div>
            <button onClick={downloadSummaryPdf} className="btn-secondary text-xs">
                📄 PDF
            </button>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">Booking confirmed</h1>
            <p className="mt-2 text-black/80">
              We’ve sent a confirmation to your email/SMS (demo). You can review details below.
            </p>
          </div>

          <div className="px-8 py-8">
            {!booking ? (
              <p className="text-gray-600">No booking details found. Please start a new booking.</p>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer Details</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <div><span className="font-semibold text-slate-900">Name:</span> {booking.name}</div>
                      <div><span className="font-semibold text-slate-900">Phone:</span> {booking.phone}</div>
                      <div><span className="font-semibold text-slate-900">Age:</span> {booking.age ?? 'N/A'}</div>
                      <div><span className="font-semibold text-slate-900">License:</span> {booking.licenseNumber ?? 'N/A'}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trip Details</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <div><span className="font-semibold text-slate-900">Vehicle:</span> {booking.vehicle}</div>
                      <div><span className="font-semibold text-slate-900">Persons:</span> {booking.persons ?? 'N/A'}</div>
                      <div><span className="font-semibold text-slate-900">Pickup:</span> {booking.deliverLocation}</div>
                      <div><span className="font-semibold text-slate-900">Drop:</span> {booking.returnLocation}</div>
                      <div><span className="font-semibold text-slate-900">Dates:</span> {booking.deliverDate} to {booking.returnDate}</div>
                      <div><span className="font-semibold text-slate-900">Duration:</span> {days} day{days === 1 ? '' : 's'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price per day</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">₹{pricePerDay}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tax</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">₹{tax}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</div>
                    <div className="mt-2 text-xl font-bold text-slate-900">₹{displayTotal}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking Info</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <div><span className="font-semibold text-slate-900">Payment method:</span> {paymentMethod}</div>
                      <div><span className="font-semibold text-slate-900">Booking ID:</span> {bookingId}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</div>
                    <div className="mt-3 text-sm text-slate-700">
                      {booking.notes ?? 'Thank you for booking with us. Your confirmation is being processed.'}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-600 bg-white p-4 md:col-span-2">
                  <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
    </>
  );
}

