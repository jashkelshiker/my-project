import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles, getBookings, getUsers } from '../../data/mockData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [vehicles, bookings, users] = await Promise.all([
        getVehicles(),
        getBookings(),
        getUsers(),
      ]);

      const revenue = bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        vehicles: vehicles.length,
        bookings: bookings.length,
        users: users.length,
        revenue,
      });
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Vehicles', value: stats.vehicles, icon: '🚗', color: 'brand' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📋', color: 'blue' },
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'purple' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'emerald' },
  ];

  return (
    <div className="py-8">
      <div className="container-page">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Manage vehicles, bookings, and users</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">{card.label}</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                </div>
                <div className="text-3xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link to="/admin/vehicles" className="card p-6 hover:shadow-lift transition">
            <div className="text-2xl mb-3">🚗</div>
            <h3 className="font-semibold text-slate-900">Manage Vehicles</h3>
            <p className="mt-2 text-sm text-slate-600">Add, edit, or remove vehicles</p>
          </Link>

          <Link to="/admin/bookings" className="card p-6 hover:shadow-lift transition">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="font-semibold text-slate-900">Manage Bookings</h3>
            <p className="mt-2 text-sm text-slate-600">View and update booking status</p>
          </Link>

          <Link to="/admin/users" className="card p-6 hover:shadow-lift transition">
            <div className="text-2xl mb-3">👥</div>
            <h3 className="font-semibold text-slate-900">Manage Users</h3>
            <p className="mt-2 text-sm text-slate-600">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
