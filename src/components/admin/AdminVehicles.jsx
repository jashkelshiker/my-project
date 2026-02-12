import { useEffect, useState, useCallback } from 'react';
import vehicleAPI from '../../services/vehicleAPI';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    vehicle_type: '',
    search: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    vehicle_type: '',
    description: '',
    price_per_day: '',
    is_active: true,
  });
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [stats, setStats] = useState(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleAPI.getAdminVehicles(filters);
      setVehicles(Array.isArray(data.results) ? data.results : data);
    } catch (err) {
      const errorMessage = typeof err === 'object' && err?.detail 
        ? err.detail 
        : typeof err === 'object' && err?.error
        ? err.error
        : 'Failed to load vehicles';
      setError(errorMessage);
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const data = await vehicleAPI.getVehicleStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    loadStats();
  }, [loadVehicles, loadStats]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name.trim(),
        vehicle_type: formData.vehicle_type,
        description: formData.description.trim(),
        price_per_day: parseFloat(formData.price_per_day),
        is_active: formData.is_active,
      };

      if (editing) {
        await vehicleAPI.updateVehicle(editing.id, payload);
        alert('Vehicle updated successfully!');
      } else {
        await vehicleAPI.createVehicle(payload);
        alert('Vehicle added successfully!');
      }
      await loadVehicles();
      resetForm();
    } catch (err) {
      const errorMessage = typeof err === 'object' 
        ? Object.entries(err)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
        : err?.detail || err || 'Error saving vehicle';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditing(vehicle);
    setFormData({
      name: vehicle.name,
      vehicle_type: vehicle.vehicle_type,
      description: vehicle.description,
      price_per_day: vehicle.price_per_day,
      is_active: vehicle.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setLoading(true);
      try {
        await vehicleAPI.deleteVehicle(id);
        alert('Vehicle deleted successfully!');
        await loadVehicles();
      } catch (err) {
        setError(err?.detail || 'Failed to delete vehicle');
        console.error('Error deleting:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      vehicle_type: '',
      description: '',
      price_per_day: '',
      is_active: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSelectVehicle = (vehicleId) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVehicles.length === vehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(vehicles.map((v) => v.id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedVehicles.length === 0) {
      alert('Please select vehicles first');
      return;
    }

    if (!window.confirm(`Mark ${selectedVehicles.length} vehicle(s) as ${newStatus ? 'active' : 'inactive'}?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await vehicleAPI.bulkUpdateStatus(selectedVehicles, newStatus);
      alert(result.message || `${result.updated} vehicle(s) updated`);
      setSelectedVehicles([]);
      await loadVehicles();
      await loadStats();
    } catch (err) {
      setError(err?.detail || 'Failed to update vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVehicles.length === 0) {
      alert('Please select vehicles first');
      return;
    }

    if (!window.confirm(`Delete ${selectedVehicles.length} vehicle(s)? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await vehicleAPI.bulkDelete(selectedVehicles);
      alert(result.message || `${result.deleted} vehicle(s) deleted`);
      setSelectedVehicles([]);
      await loadVehicles();
      await loadStats();
    } catch (err) {
      setError(err?.detail || 'Failed to delete vehicles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container-page">
        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Error: {error}</p>
            <p className="mt-2 text-xs text-red-600">Check browser console (F12) for more details</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Manage Vehicles</h1>
            <p className="mt-2 text-sm text-slate-600">Add, edit, or remove vehicles from the system</p>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setShowForm(true);
            }} 
            className="btn-primary"
            disabled={loading}
          >
            <span>+ Add Vehicle</span>
          </button>
        </div>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-slate-600">Total Vehicles</h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-slate-600">Active</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.active}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-slate-600">Inactive</h3>
              <p className="mt-2 text-3xl font-bold text-slate-600">{stats.inactive}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-slate-600">Avg Price</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">${stats.average_price?.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mb-8 p-6">
            <h2 className="mb-4 font-semibold text-slate-900">{editing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Vehicle Name *</label>
                <input
                  type="text"
                  className="field mt-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Toyota Innova"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Vehicle Type *</label>
                <select
                  className="field mt-2"
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                  required
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  <option value="MINI_BUS">Mini Bus</option>
                  <option value="TEMPO_TRAVELLER">Tempo Traveller</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="MINI_CAR">Mini Car</option>
                </select>
              </div>

              <div>
                <label className="label">Price per Day *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="field mt-2"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                  placeholder="e.g., 500.00"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="field mt-2"
                  value={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                  disabled={loading}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea
                  className="field mt-2"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter vehicle details, features, etc."
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : `${editing ? 'Update' : 'Add'} Vehicle`}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6 p-4">
          <h3 className="mb-4 font-semibold text-slate-900">Filters</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Vehicle Type</label>
              <select
                className="field mt-2"
                value={filters.vehicle_type}
                onChange={(e) => setFilters({ ...filters, vehicle_type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="MINI_BUS">Mini Bus</option>
                <option value="TEMPO_TRAVELLER">Tempo Traveller</option>
                <option value="SEDAN">Sedan</option>
                <option value="MINI_CAR">Mini Car</option>
              </select>
            </div>
            <div>
              <label className="label">Search</label>
              <input
                type="text"
                className="field mt-2"
                placeholder="Search by name..."
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ vehicle_type: '', search: '' })}
                className="btn-secondary w-full"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedVehicles.length > 0 && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="mb-3 font-medium text-blue-900">
              {selectedVehicles.length} vehicle(s) selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                disabled={loading}
              >
                Mark as Active
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                disabled={loading}
              >
                Mark as Inactive
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedVehicles([])}
                className="rounded-lg bg-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-400"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Vehicles Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600">No vehicles found. Add one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 w-12">
                      <input
                        type="checkbox"
                        checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
                        indeterminate={selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Price/Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className={`hover:bg-slate-50 ${selectedVehicles.includes(vehicle.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 text-sm w-12">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(vehicle.id)}
                          onChange={() => handleSelectVehicle(vehicle.id)}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{vehicle.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {vehicle.vehicle_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">${vehicle.price_per_day}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            vehicle.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {vehicle.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(vehicle.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(vehicle)} 
                            className="btn-ghost px-3 py-1 text-xs"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
