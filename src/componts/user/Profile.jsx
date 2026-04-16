import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authAPI from '../../services/authAPI';
import { useNotifications } from '../../context/NotificationContext';

export default function Profile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const { sendVerificationCode, verifyPhone } = useNotifications();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    phone_number: user?.phone_number || user?.phone || '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState('');

  const handleSendCode = async () => {
    try {
      await sendVerificationCode(form.phone_number);
      setVerificationSent(true);
      alert('Verification code sent');
    } catch (err) {
      console.error(err);
      alert('Failed to send verification code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyPhone(code);
      alert('Phone verified successfully');
      // refresh profile from backend
      const profile = await authAPI.getProfile();
      login(profile);
      setVerificationSent(false);
      setCode('');
    } catch (err) {
      console.error(err);
      alert(err.error || err.detail || 'Invalid verification code');
    }
  };
  const handleSave = () => {
    // Call backend to update profile
    (async () => {
      try {
        const payload = {
          first_name: form.name,
          email: form.email,
          phone_number: form.phone_number,
        };
        const updated = await authAPI.updateProfile(payload);

        // update local auth context + storage
        const merged = {
          ...user,
          ...updated,
          phone: updated.phone_number || updated.phone || user.phone,
          phone_number: updated.phone_number || user.phone || user.phone_number,
        };
        // use login from auth context to update stored user
        // eslint-disable-next-line no-use-before-define
        login(merged);
        setEditing(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to save profile', err);
        alert(err.detail || 'Failed to update profile');
      }
    })();
  };

  return (
    // use a soft green‑to‑white gradient instead of a flat slate background
    <div className="py-8 bg-gradient-to-br from-brand-50 to-white min-h-screen">
      <div className="container-page">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account details</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6 md:col-span-1">
            <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center text-4xl font-bold text-brand-700">{(user?.name || 'U').charAt(0)}</div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-semibold text-gray-900">{user?.name}</div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-semibold text-gray-900">{user?.email}</div>
            </div>
          </div>

          <div className="card p-6 md:col-span-2">
            <h2 className="font-semibold text-lg text-gray-900">Account details</h2>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Phone</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 placeholder-gray-500"
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

            {/* Verification controls */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">Phone verification</p>
              <div className="flex gap-2 mt-2 items-center">
                <button onClick={handleSendCode} className="btn-secondary">Send verification code</button>
                {verificationSent && (
                  <>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter code"
                      className="rounded-md border border-gray-300 p-2 text-sm bg-white text-gray-900 placeholder-gray-400"
                    />
                    <button onClick={handleVerifyCode} className="btn-primary">Verify</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
