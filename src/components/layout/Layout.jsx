import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_CONFIG } from '../../constants/appConstants';
import Button from '../ui/Button';

/**
 * NavItem Component
 */
function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-slate-900 text-white'
            : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
      end
    >
      {label}
    </NavLink>
  );
}

/**
 * Layout Component
 * Main layout wrapper with header and footer
 */
export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const isAuth = useMemo(
    () => location.pathname.startsWith(ROUTES.AUTH),
    [location.pathname]
  );

  if (isAuth) return <Outlet />;

  const navItems = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.BOOKING, label: 'Book' },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            to={
              isAdmin()
                ? ROUTES.ADMIN_DASHBOARD
                : isAuthenticated
                ? ROUTES.DASHBOARD
                : ROUTES.HOME
            }
            className="flex items-center gap-2"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-400 shadow-soft" />
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight text-slate-900">
                {APP_CONFIG.NAME}
              </div>
              <div className="text-xs text-slate-500">
                {isAdmin() ? 'Admin Panel' : APP_CONFIG.TAGLINE}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {!isAuthenticated &&
              navItems.map((it) => (
                <NavItem key={it.to} to={it.to} label={it.label} />
              ))}

            {isAuthenticated && (
              <>
                {isAdmin() ? (
                  <>
                    <NavItem to={ROUTES.ADMIN_DASHBOARD} label="Dashboard" />
                    <NavItem to={ROUTES.ADMIN_VEHICLES} label="Vehicles" />
                    <NavItem to={ROUTES.ADMIN_BOOKINGS} label="Bookings" />
                    <NavItem to={ROUTES.ADMIN_USERS} label="Users" />
                  </>
                ) : (
                  <>
                    <NavItem to={ROUTES.DASHBOARD} label="Dashboard" />
                    <NavItem to={ROUTES.BOOKING} label="Book" />
                  </>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                  <span className="text-sm text-slate-600">{user?.name}</span>
                  <Button variant="ghost" onClick={handleLogout} className="text-sm">
                    Logout
                  </Button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link to={ROUTES.AUTH} className="btn-ghost">
                  Sign in
                </Link>
                <Link to={ROUTES.BOOKING} className="btn-primary">
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
            <span className="text-base">{open ? '✕' : '☰'}</span>
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200/60 bg-white md:hidden">
            <div className="container-page flex flex-col gap-2 py-3">
              {!isAuthenticated &&
                navItems.map((it) => (
                  <NavItem
                    key={it.to}
                    to={it.to}
                    label={it.label}
                    onClick={() => setOpen(false)}
                  />
                ))}

              {isAuthenticated && (
                <>
                  {isAdmin() ? (
                    <>
                      <NavItem
                        to={ROUTES.ADMIN_DASHBOARD}
                        label="Dashboard"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.ADMIN_VEHICLES}
                        label="Vehicles"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.ADMIN_BOOKINGS}
                        label="Bookings"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.ADMIN_USERS}
                        label="Users"
                        onClick={() => setOpen(false)}
                      />
                    </>
                  ) : (
                    <>
                      <NavItem
                        to={ROUTES.DASHBOARD}
                        label="Dashboard"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.BOOKING}
                        label="Book"
                        onClick={() => setOpen(false)}
                      />
                    </>
                  )}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">{user?.name}</div>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to={ROUTES.AUTH}
                    className="btn-secondary w-full"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to={ROUTES.BOOKING}
                    className="btn-primary w-full"
                    onClick={() => setOpen(false)}
                  >
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
              <div className="font-display text-lg font-bold">{APP_CONFIG.NAME}</div>
              <p className="mt-2 text-sm text-slate-600">
                Verified vehicles, transparent pricing, and a smooth booking
                experience.
              </p>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">Quick links</div>
              <div className="mt-3 flex flex-col gap-2 text-slate-600">
                <Link className="hover:text-slate-900" to={ROUTES.HOME}>
                  Home
                </Link>
                <Link className="hover:text-slate-900" to={ROUTES.BOOKING}>
                  Book
                </Link>
                <Link className="hover:text-slate-900" to={ROUTES.AUTH}>
                  Sign in
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">Contact</div>
              <div className="mt-3 text-slate-600">
                <div>{APP_CONFIG.SUPPORT_EMAIL}</div>
                <div className="mt-1">{APP_CONFIG.SUPPORT_HOURS}</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.</div>
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
