import { useEffect, useState } from 'react';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../../data/mockData';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    price: '',
    seats: '',
    description: '',
    available: true,
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateVehicle(editing.id, formData);
      } else {
        await addVehicle(formData);
      }
      await loadVehicles();
      resetForm();
    } catch (error) {
      alert('Error saving vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setEditing(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      model: vehicle.model,
      price: vehicle.price,
      seats: vehicle.seats,
      description: vehicle.description,
      available: vehicle.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      await loadVehicles();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      model: '',
      price: '',
      seats: '',
      description: '',
      available: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="py-8">
      <div className="container-page">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Manage Vehicles</h1>
            <p className="mt-2 text-sm text-slate-600">Add, edit, or remove vehicles from the system</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add Vehicle
          </button>
        </div>

        {showForm && (
          <div className="card mb-8 p-6">
            <h2 className="mb-4 font-semibold text-slate-900">{editing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Vehicle Name</label>
                <input
                  type="text"
                  className="field mt-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  className="field mt-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Mini Bus">Mini Bus</option>
                  <option value="Maxi Cab">Maxi Cab</option>
                </select>
              </div>
              <div>
                <label className="label">Model</label>
                <input
                  type="text"
                  className="field mt-2"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Price per Day (₹)</label>
                <input
                  type="number"
                  className="field mt-2"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Seats</label>
                <input
                  type="number"
                  className="field mt-2"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Availability</label>
                <select
                  className="field mt-2"
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea
                  className="field mt-2"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary">
                  {editing ? 'Update' : 'Add'} Vehicle
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{vehicle.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.model}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{vehicle.price}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.seats}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          vehicle.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(vehicle)} className="btn-ghost px-3 py-1 text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
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
        </div>
      </div>
    </div>
  );
}
