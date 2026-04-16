import { useEffect, useMemo, useState } from 'react';
import userAPI from '../../services/userAPI';
import notificationAPI, { NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '../../services/notificationAPI';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sendOpen, setSendOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifType, setNotifType] = useState(NOTIFICATION_TYPES.GENERAL_ALERT);
  const [channel, setChannel] = useState(NOTIFICATION_CHANNELS.SMS);
  const [message, setMessage] = useState('');
  const [phoneOverride, setPhoneOverride] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await userAPI.getUsers();
      setUsers(resp.results || resp);
    } catch (e) {
      setError(e.detail || e.error || e.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    return (users || []).map((u) => {
      const name =
        (u.first_name || u.last_name)
          ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
          : u.username;

      return {
        id: u.id,
        name,
        email: u.email,
        role: (u.role || '').toLowerCase(),
        phone_number: u.phone_number || '',
        phone_verified: !!u.phone_verified,
        date_joined: u.date_joined,
        raw: u,
      };
    });
  }, [users]);

  const openSend = (u) => {
    setSelectedUser(u);
    setNotifType(NOTIFICATION_TYPES.GENERAL_ALERT);
    setMessage('');
    // prefill override field with existing number (may be empty)
    setPhoneOverride(u.phone_number || '');
    setSendOpen(true);
  };

  const closeSend = () => {
    setSendOpen(false);
    setSelectedUser(null);
    setSending(false);
  };

  const handleSend = async () => {
    if (!selectedUser) return;

    // validate phone presence
    let destPhone = phoneOverride.trim();
    // strip whatsapp: prefix if user accidentally included it
    if (channel === NOTIFICATION_CHANNELS.WHATSAPP && destPhone.toLowerCase().startsWith('whatsapp:')) {
      destPhone = destPhone.split(':')[1];
    }
    if (!destPhone) {
      setError('Cannot send notification without a phone number');
      return;
    }

    setSending(true);
    setError('');
    try {
      await notificationAPI.adminSendNotification({
        user_id: selectedUser.id,
        notification_type: notifType,
        channel,
        message: message?.trim() || undefined,
        phone_number: destPhone,
      });
      closeSend();
      // optional refresh to show updated phone verification etc.
      await loadUsers();
    } catch (e) {
      setError(e.detail || e.error || e.message || 'Failed to send notification');
      setSending(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container-page">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-black">Manage Users</h1>
          <p className="mt-2 text-sm text-gray-700">View all registered users</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {sendOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="card mx-4 w-full max-w-lg p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-black">Send notification</div>
                  <div className="mt-1 text-sm text-gray-700">
                    To <span className="font-semibold">{selectedUser.name}</span> ({selectedUser.email})
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Phone: {selectedUser.phone_number || '—'} {selectedUser.phone_verified ? '(verified)' : ''}
                  </div>
                </div>
                <button className="btn-ghost" type="button" onClick={closeSend}>
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Channel</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                  >
                    <option value={NOTIFICATION_CHANNELS.SMS}>SMS</option>
                    <option value={NOTIFICATION_CHANNELS.WHATSAPP}>WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="label mb-2">Type</label>
                  <select
                    className="input w-full"
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value)}
                  >
                    {Object.values(NOTIFICATION_TYPES).map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label mb-2">Message (optional)</label>
                  <textarea
                    className="input w-full min-h-[110px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="If empty, backend uses default message for the type."
                  />
                </div>

                <div>
                  <label className="label mb-2">
                    Phone number {selectedUser?.phone_number ? '(override)' : '(required)'}
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={phoneOverride}
                    onChange={(e) => setPhoneOverride(e.target.value)}
                    placeholder="+1234567890"
                  />
                  {channel === NOTIFICATION_CHANNELS.WHATSAPP && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the phone number in E.164 format (e.g. +15551234567).
                      Do <em>not</em> include <code>whatsapp:</code> prefix;
                      it will be added automatically.
                    </p>
                  )}
                  {!phoneOverride && (
                    <p className="text-xs text-red-600 mt-1">
                      Phone number is required for SMS delivery.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button className="btn-secondary" type="button" onClick={closeSend} disabled={sending}>
                    Cancel
                  </button>
                  <button className="btn-primary" type="button" onClick={handleSend} disabled={sending}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-600" colSpan={7}>
                      Loading users...
                    </td>
                  </tr>
                ) : rows.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{user.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.phone_number || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.date_joined ? new Date(user.date_joined).toISOString().slice(0, 10) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => openSend(user)}
                        disabled={!user.phone_number}
                        title={!user.phone_number ? 'User has no phone number' : 'Send notification'}
                      >
                        Notify
                      </button>
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
