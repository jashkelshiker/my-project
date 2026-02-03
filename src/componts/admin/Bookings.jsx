import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '../../data/mockData';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getBookings();
    setBookings(data);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await updateBookingStatus(id, newStatus);
    await loadBookings();
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="py-8">
      <div className="container-page">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Manage Bookings</h1>
          <p className="mt-2 text-sm text-slate-600">View and update booking status</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.userName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.vehicleName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{booking.pickupDate}</div>
                      <div className="text-xs text-slate-500">to {booking.returnDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{booking.pickupLocation}</div>
                      <div className="text-xs text-slate-500">→ {booking.dropLocation}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{booking.totalPrice}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[booking.status] || statusColors.pending}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
