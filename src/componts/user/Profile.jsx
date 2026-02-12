import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = () => {
    // In this demo the auth context likely doesn't expose an update method.
    // Replace with real API call / context update as needed.
    setEditing(false);
    // eslint-disable-next-line no-console
    console.log('Save profile data', form);
  };

  return (
    <div className="py-8">
      <div className="container-page">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your account details</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6 md:col-span-1">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-600">{(user?.name || 'U').charAt(0)}</div>
            <div className="mt-4">
              <div className="text-sm text-slate-600">Name</div>
              <div className="font-semibold text-slate-900">{user?.name}</div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-slate-600">Email</div>
              <div className="font-semibold text-slate-900">{user?.email}</div>
            </div>
          </div>

          <div className="card p-6 md:col-span-2">
            <h2 className="font-semibold text-lg text-slate-900">Account details</h2>
            <div className="mt-4">
              <label className="block text-sm text-slate-600">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-slate-200 p-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-slate-600">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-slate-200 p-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-slate-600">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-slate-200 p-2"
              />
            </div>

            <div className="mt-6 flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleSave} className="btn-primary">Save</button>
                  <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-primary">Edit profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
