import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          isActive ? "bg-brand-600 text-white" : "text-black hover:bg-gray-100",
        ].join(" ")
      }
      end
    >
      {label}
    </NavLink>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { notifications, unreadCount, loadNotifications, markAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    // load notifications when user opens the menu or on mount if authenticated
    if (isAuthenticated && !isAdmin()) loadNotifications();
  }, [isAuthenticated, isAdmin, loadNotifications]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const isAuth = useMemo(() => location.pathname.startsWith("/auth"), [location.pathname]);
  if (isAuth) return <Outlet />;

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/booking", label: "Book" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-soft">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to={isAdmin() ? "/admin/dashboard" : isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-400 shadow-soft" />
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight text-black">GreenRide</div>
              <div className="text-xs text-gray-700">{isAdmin() ? "Admin Panel" : "Premium rentals"}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {!isAuthenticated && navItems.map((it) => (
              <NavItem key={it.to} to={it.to} label={it.label} />
            ))}
            
            {isAuthenticated && (
              <>
                {isAdmin() ? (
                  <>
                    <NavItem to="/admin/dashboard" label="Dashboard" />
                    <NavItem to="/admin/vehicles" label="Vehicles" />
                    <NavItem to="/admin/bookings" label="Bookings" />
                    <NavItem to="/admin/users" label="Users" />
                  </>
                ) : (
                  <>
                    <NavItem to="/dashboard" label="Dashboard" />
                    <NavItem to="/booking" label="Book" />
                    <NavItem to="/favorites" label="Favorites" />
                    <NavItem to="/profile" label="Profile" />
                  </>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  {/* Notification bell: show only for authenticated non-admin users */}
                  {!isAdmin() && (
                    <div className="relative" ref={notifRef}>
                      <button
                        aria-label="Notifications"
                        onClick={(e) => { e.stopPropagation(); setNotifOpen(v => !v); }}
                        className="relative btn-ghost p-2"
                      >
                        <span className="text-xl">🔔</span>
                        {unreadCount > 0 && (
                          <span className="absolute -top-0 -right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">{unreadCount}</span>
                        )}
                      </button>

                      {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 max-w-xs rounded-lg border bg-white shadow-lg z-50">
                          <div className="p-3 border-b font-semibold">Notifications</div>
                          <div className="max-h-64 overflow-auto">
                            {notifications.length === 0 && (
                              <div className="p-3 text-sm text-gray-600">No notifications</div>
                            )}
                            {notifications.map((n) => (
                              <button
                                key={n.id}
                                onClick={() => { markAsRead(n.id); setNotifOpen(false); }}
                                className={`w-full text-left p-3 hover:bg-gray-50 ${n.is_read ? 'opacity-70' : 'font-medium'}`}
                              >
                                <div className="text-sm text-slate-900">{n.title || n.message || 'Notification'}</div>
                                <div className="text-xs text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</div>
                              </button>
                            ))}
                          </div>
                          <div className="p-2 border-t text-center">
                            <Link to="/my-bookings" className="text-sm text-brand-600">View all</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-sm text-black">{user?.name}</span>
                  <button onClick={handleLogout} className="btn-ghost text-sm">
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link to="/auth" className="btn-ghost">
                  Sign in
                </Link>
                <Link to="/booking" className="btn-primary">
                  Book now
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="text-base">{open ? "✕" : "☰"}</span>
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-200 bg-white md:hidden">
            <div className="container-page flex flex-col gap-2 py-3">
              {!isAuthenticated && navItems.map((it) => (
                <NavItem key={it.to} to={it.to} label={it.label} onClick={() => setOpen(false)} />
              ))}
              
              {isAuthenticated && (
                <>
                  {isAdmin() ? (
                    <>
                      <NavItem to="/admin/dashboard" label="Dashboard" onClick={() => setOpen(false)} />
                      <NavItem to="/admin/vehicles" label="Vehicles" onClick={() => setOpen(false)} />
                      <NavItem to="/admin/bookings" label="Bookings" onClick={() => setOpen(false)} />
                      <NavItem to="/admin/users" label="Users" onClick={() => setOpen(false)} />
                    </>
                  ) : (
                    <>
                      <NavItem to="/dashboard" label="Dashboard" onClick={() => setOpen(false)} />
                      <NavItem to="/booking" label="Book" onClick={() => setOpen(false)} />
                      <NavItem to="/favorites" label="Favorites" onClick={() => setOpen(false)} />
                      <NavItem to="/profile" label="Profile" onClick={() => setOpen(false)} />
                    </>
                  )}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-sm text-black mb-2">{user?.name}</div>
                    <button onClick={handleLogout} className="btn-secondary w-full">
                      Logout
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/auth" className="btn-secondary w-full" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/booking" className="btn-primary w-full" onClick={() => setOpen(false)}>
                    Book now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container-page py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="font-display text-lg font-bold text-brand-600">GreenRide</div>
              <p className="mt-2 text-sm text-gray-600">
                Verified vehicles, transparent pricing, and a smooth booking experience.
              </p>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-black">Quick links</div>
              <div className="mt-3 flex flex-col gap-2 text-gray-700">
                <Link className="text-gray-700 hover:text-brand-600" to="/">
                  Home
                </Link>
                <Link className="text-gray-700 hover:text-brand-600" to="/booking">
                  Book
                </Link>
                <Link className="text-gray-700 hover:text-brand-600" to="/auth">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-black">Contact</div>
              <div className="mt-3 text-gray-700">
                <div>support@greenride.com</div>
                <div className="mt-1">Mon–Sun, 9am–9pm</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-600 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} GreenRide. All rights reserved.</div>
            <div className="flex gap-4 text-gray-600">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
