import React, { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
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
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to={isAdmin() ? "/admin/dashboard" : isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-400 shadow-soft" />
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight text-slate-900">GreenRide</div>
              <div className="text-xs text-slate-500">{isAdmin() ? "Admin Panel" : "Premium rentals"}</div>
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
                  </>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <span className="text-sm text-slate-600">{user?.name}</span>
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
          <div className="border-t border-slate-200/60 bg-white md:hidden">
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
                    </>
                  )}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">{user?.name}</div>
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

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="container-page py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="font-display text-lg font-bold">GreenRide</div>
              <p className="mt-2 text-sm text-slate-600">
                Verified vehicles, transparent pricing, and a smooth booking experience.
              </p>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">Quick links</div>
              <div className="mt-3 flex flex-col gap-2 text-slate-600">
                <Link className="hover:text-slate-900" to="/">
                  Home
                </Link>
                <Link className="hover:text-slate-900" to="/booking">
                  Book
                </Link>
                <Link className="hover:text-slate-900" to="/auth">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">Contact</div>
              <div className="mt-3 text-slate-600">
                <div>support@greenride.com</div>
                <div className="mt-1">Mon–Sun, 9am–9pm</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} GreenRide. All rights reserved.</div>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

