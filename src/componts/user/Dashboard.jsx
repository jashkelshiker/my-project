import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBookings } from '../../data/mockData';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      const allBookings = await getBookings();
      // Filter bookings for current user (in real app, API would filter)
      const userBookings = allBookings.filter((b) => b.userId === user?.id || b.userName === user?.name);
      setBookings(userBookings);
    };

    loadBookings();
  }, [user?.id, user?.name]);

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
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">My Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Welcome back, {user?.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <div className="text-sm font-medium text-slate-600">Total Bookings</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{bookings.length}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-slate-600">Confirmed</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-slate-600">Pending</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === 'pending').length}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">My Bookings</h2>
          <Link to="/booking" className="btn-primary">
            + New Booking
          </Link>
        </div>

        <div className="mt-6">
          {bookings.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-slate-900">No bookings yet</h3>
              <p className="mt-2 text-sm text-slate-600">Start by booking your first vehicle</p>
              <Link to="/booking" className="btn-primary mt-4">
                Book Now
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">#{booking.id}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
