import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookingAPI from "../services/bookingAPI";
import Preloader from "../components/common/Preloader";

export default function VehicleRentalSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // if we landed with state, cache it so confirmation page can use even after refresh
  useEffect(() => {
    if (state) {
      try {
        sessionStorage.setItem('bookingData', JSON.stringify(state));
      } catch (e) {
        console.warn('could not save bookingData', e);
      }
    }
  }, [state]);
  const [booking, setBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/summary" } } });
    }
  }, [isAuthenticated, navigate]);

  // create booking as soon as customer reaches summary (one-time, only when logged in)
  React.useEffect(() => {
    if (state && !booking && !saving && isAuthenticated) {
      setSaving(true);
      bookingAPI.createBooking({
        vehicle: state.vehicleId,
        start_date: state.deliverDate,
        end_date: state.returnDate,
        details: { ...state },
      })
        .then(resp => setBooking(resp))
        .catch(err => {
          console.error('booking creation failed', err);
          // not blocking the UI - user can try again by clicking proceed
        })
        .finally(() => setSaving(false));
    }
  }, [state, booking, saving, isAuthenticated]);

  if (!state) {
    return (
      <div className="py-12">
        <div className="container-page">
          <div className="card mx-auto max-w-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">No booking data found</h2>
            <p className="text-sm text-gray-700 mb-6">Please start a new booking</p>
            <button onClick={() => navigate("/booking")} className="btn-primary">
              Start Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = Math.ceil((new Date(state.returnDate) - new Date(state.deliverDate)) / (1000 * 60 * 60 * 24));

  // if price missing or zero, try to infer from persons or vehicle type
  const inferPrice = () => {
    if (state.price && state.price > 0) return state.price;
    // fallback to same logic used in booking page
    const p = Number(state.persons) || 0;
    if (p >= 30) return 5200;
    if (p >= 12) return 3600;
    if (p >= 7) return 3000;
    if (p >= 4) return 2000;
    return 0;
  };

  const pricePerDay = inferPrice();
  const totalPrice = pricePerDay * days;
  const tax = Math.round(totalPrice * 0.17);
  const finalTotal = totalPrice + tax;


  // Pdf version
  const downloadSummaryPdf = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageHeight = doc.internal.pageSize.height;
      let y = 40;

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Summary', 40, y);
      y += 20;
      doc.setLineWidth(1);
      doc.line(40, y, 555, y);
      y += 20;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const items = [
        {label:'Name', value: state.name},
        {label:'Phone', value: state.phone},
        {label:'Vehicle', value: state.vehicle},
        {label:'Persons', value: state.persons},
        {label:'Pickup', value: state.deliverLocation},
        {label:'Drop', value: state.returnLocation},
        {label:'Dates', value: `${state.deliverDate} to ${state.returnDate}`},
        {label:'Duration', value: `${days} day${days>1?'s':''}`},
        {label:'Price/day', value: `₹${pricePerDay}`},
        {label:'Days', value: days},
        {label:'Subtotal', value: `₹${totalPrice}`},
        {label:'Tax (17%)', value: `₹${tax}`},
        {label:'Total', value: `₹${finalTotal}`}
      ];

      items.forEach(({label,value})=>{
        if (y > pageHeight - 60) { doc.addPage(); y = 40; }
        doc.text(`${label}: ${value}`, 40, y);
        y += 18;
      });

      // Footer with page number
      const pageCount = doc.internal.getNumberOfPages();
      for (let i=1;i<=pageCount;i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 300, pageHeight - 30, null, null, 'center');
      }

      doc.save('booking-summary.pdf');
    });
  };


  return (
    <>
      <Preloader isVisible={isNavigating || saving} message={isNavigating ? "Processing payment..." : "Creating booking..."} />
      <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-2xl p-8 md:p-10">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Booking Summary</h2>
              <p className="mt-2 text-sm text-gray-700">Review your booking details before proceeding to payment</p>
            </div>
            <button onClick={downloadSummaryPdf} className="btn-secondary text-sm">
              📄 PDF
            </button>
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
                <span className="font-medium text-slate-900">₹{pricePerDay}</span>
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
                <span className="text-slate-600">Tax (17%)</span>
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
              onClick={async () => {
                setIsNavigating(true);
                // must know which vehicle we're booking
                if (!state.vehicleId) {
                  alert('Cannot create booking: vehicle not selected');
                  return;
                }

                // ensure booking record exists
                if (!booking && !saving) {
                  setSaving(true);
                  try {
                    const payload = {
                      vehicle: state.vehicleId,
                      start_date: state.deliverDate,
                      end_date: state.returnDate,
                      details: { ...state },
                    };
                    const resp = await bookingAPI.createBooking(payload);
                    setBooking(resp);
                  } catch (err) {
                    console.error('booking creation error', err);
                    const msg = err.detail || err.error || JSON.stringify(err);
                    alert(msg || 'Failed to create booking');
                    setSaving(false);
                    // if vehicle unavailable, send user back to adjust selection
                    if (msg && msg.toLowerCase().includes('already booked')) {
                      setIsNavigating(false);
                      navigate('/booking', { state: { ...state }, replace: true });
                      return;
                    }
                    setIsNavigating(false);
                    return;
                  }
                  setIsNavigating(false);
                }
                navigate("/payment", { state: { ...state, totalPrice: finalTotal, days, tax, bookingId: booking?.id } });
              }}
              className="btn-primary flex-1"
              disabled={saving || isNavigating}
            >
              {isNavigating ? "Processing..." : (saving ? "Saving..." : "Proceed to Payment →")}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
