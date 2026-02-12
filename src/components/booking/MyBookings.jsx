import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBookings } from '../../data/mockData';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { BOOKING_STATUS, ROUTES } from '../../constants/appConstants';

/**
 * My Bookings Component
 * Displays user's all bookings with status, filtering, and management options
 */
export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  /* ---------- LOAD BOOKINGS ---------- */
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const allBookings = await getBookings();
        // Filter bookings for current user
        const userBookings = allBookings.filter(
          (b) => b.userId === user?.id || b.userName === user?.name
        );
        setBookings(userBookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || user?.name) {
      loadBookings();
    }
  }, [user?.id, user?.name]);

  /* ---------- FILTER & SEARCH BOOKINGS ---------- */
  useEffect(() => {
    let result = [...bookings];

    // Apply status filter
    if (filter !== 'all') {
      result = result.filter((b) => b.status === filter);
    }

    // Apply search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.vehicleName.toLowerCase().includes(search) ||
          b.pickupLocation.toLowerCase().includes(search) ||
          b.dropLocation.toLowerCase().includes(search) ||
          b.id.toString().includes(search)
      );
    }

    setFilteredBookings(result);
  }, [bookings, filter, searchTerm]);

  /* ---------- STATUS STYLING ---------- */
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      completed: 'bg-blue-50 text-blue-700 border border-blue-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      completed: '✓✓',
      cancelled: '✕',
    };
    return icons[status] || '◎';
  };

  /* ---------- CALCULATE DAYS ---------- */
  const calculateDays = (pickup, dropoff) => {
    const from = new Date(pickup);
    const to = new Date(dropoff);
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
  };

  /* ---------- HANDLE CANCEL BOOKING ---------- */
  const handleCancelBooking = (bookingId) => {
    setCancelBookingId(bookingId);
    setShowConfirmation(true);
  };

  /* ---------- CONFIRM CANCEL ---------- */
  const confirmCancel = () => {
    if (cancelBookingId) {
      setBookings((prev) =>
        prev.map((b) => (b.id === cancelBookingId ? { ...b, status: 'cancelled' } : b))
      );
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 3000);
    }
    setShowConfirmation(false);
    setCancelBookingId(null);
  };

  /* ---------- CANCEL CONFIRMATION ---------- */
  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setCancelBookingId(null);
  };

  /* ---------- HANDLE VIEW DETAILS ---------- */
  const handleViewDetails = (booking) => {
    navigate(`/booking/${booking.id}`, { state: { booking } });
  };

  /* ---------- STATS ---------- */
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
    confirmed: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length,
    completed: bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length,
  };

  /* ---------- UI ---------- */
  if (!user) {
    return (
      <div className="py-12">
        <div className="container-page">
          <Card className="px-8 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <p className="text-slate-600 mb-6">You need to be logged in to view your bookings</p>
            <Button onClick={() => navigate(ROUTES.AUTH)}>Go to Login</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container-page">
        {/* ---------- SUCCESS MESSAGE ---------- */}
        {cancelSuccess && (
          <Alert variant="success" className="mb-6">
            ✓ Booking cancelled successfully
          </Alert>
        )}

        {/* ---------- CONFIRMATION DIALOG ---------- */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Card className="mx-4 max-w-md p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Booking?</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={cancelConfirmation}>
                  Keep Booking
                </Button>
                <Button variant="danger" onClick={confirmCancel}>
                  Cancel Booking
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* ---------- HEADER ---------- */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              My Bookings
            </h1>
            <p className="mt-2 text-slate-600">View and manage all your vehicle bookings</p>
          </div>
          <Button onClick={() => navigate(ROUTES.BOOKING)} className="mt-4 md:mt-0">
            + New Booking
          </Button>
        </div>

        {/* ---------- STATS CARDS ---------- */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="px-6 py-4 border-l-4 border-l-slate-400">
            <div className="text-sm font-medium text-slate-600">Total</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</div>
          </Card>
          <Card className="px-6 py-4 border-l-4 border-l-yellow-400">
            <div className="text-sm font-medium text-yellow-600">Pending</div>
            <div className="mt-2 text-3xl font-bold text-yellow-700">{stats.pending}</div>
          </Card>
          <Card className="px-6 py-4 border-l-4 border-l-emerald-400">
            <div className="text-sm font-medium text-emerald-600">Confirmed</div>
            <div className="mt-2 text-3xl font-bold text-emerald-700">{stats.confirmed}</div>
          </Card>
          <Card className="px-6 py-4 border-l-4 border-l-blue-400">
            <div className="text-sm font-medium text-blue-600">Completed</div>
            <div className="mt-2 text-3xl font-bold text-blue-700">{stats.completed}</div>
          </Card>
        </div>

        {/* ---------- FILTERS & SEARCH ---------- */}
        <Card className="mb-8 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by vehicle, location, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ---------- BOOKINGS LIST ---------- */}
        <Card>
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              <p className="mt-4 text-slate-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              {bookings.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
                  <p className="mt-2 text-slate-600 mb-6">
                    Start by creating your first vehicle booking
                  </p>
                  <Button onClick={() => navigate(ROUTES.BOOKING)}>
                    Book Your First Vehicle
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-slate-900">No matching bookings</h3>
                  <p className="mt-2 text-slate-600">Try adjusting your search or filter</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredBookings.map((booking) => {
                const days = calculateDays(booking.pickupDate, booking.returnDate);
                return (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:items-center">
                      {/* Booking ID & Status */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Booking ID
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">#{booking.id}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                          {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      {/* Vehicle & Dates */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Vehicle
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">{booking.vehicleName}</p>
                        <p className="mt-2 text-xs text-slate-600">
                          {days} day{days > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Pickup Date */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Pickup
                        </p>
                        <p className="mt-1 text-sm text-slate-900">{booking.pickupDate}</p>
                        <p className="text-xs text-slate-600 mt-1">{booking.pickupLocation}</p>
                      </div>

                      {/* Dropoff Date */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Dropoff
                        </p>
                        <p className="mt-1 text-sm text-slate-900">{booking.returnDate}</p>
                        <p className="text-xs text-slate-600 mt-1">{booking.dropLocation}</p>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Total Price
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatPrice(booking.totalPrice)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>
                        {booking.status === 'pending' && (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ---------- SUMMARY INFO ---------- */}
        {bookings.length > 0 && (
          <Card className="mt-8 p-6 bg-brand-50 border-l-4 border-l-brand-500">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPrice(
                    bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Average Trip Duration</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {(
                    bookings.reduce(
                      (sum, b) => sum + calculateDays(b.pickupDate, b.returnDate),
                      0
                    ) / bookings.length
                  ).toFixed(1)}{' '}
                  days
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Favorite Vehicle</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {bookings.length > 0
                    ? bookings.reduce((acc, b) => {
                        acc[b.vehicleName] = (acc[b.vehicleName] || 0) + 1;
                        return acc;
                      }, {}) &&
                      Object.keys(
                        bookings.reduce((acc, b) => {
                          acc[b.vehicleName] = (acc[b.vehicleName] || 0) + 1;
                          return acc;
                        }, {})
                      ).reduce((a, b, _, obj) =>
                        obj[a] > obj[b] ? a : b
                      )
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
