import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_CONFIG } from '../../constants/appConstants';
import Button from '../ui/Button';
import NotificationBell from '../notifications/NotificationBell';

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
            ? 'bg-brand-600 text-white'
            : 'text-black hover:bg-gray-100',
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
    { to: ROUTES.VEHICLES, label: 'Browse' },
    { to: ROUTES.BOOKING, label: 'Book' },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-soft">
        <div className="container-page flex h-18 items-center justify-between py-3">
          <Link
            to={
              isAdmin()
                ? ROUTES.ADMIN_DASHBOARD
                : isAuthenticated
                ? ROUTES.DASHBOARD
                : ROUTES.HOME
            }
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-2xl shadow-lift bg-gradient-to-br from-brand-600 to-emerald-400 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.5 8H8.5L12 2Z" fill="white" opacity="0.95" />
                <circle cx="12" cy="14" r="6" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold tracking-tight text-brand-600">
                {APP_CONFIG.NAME}
              </div>
              <div className="text-xs text-slate-600">{isAdmin() ? 'Admin Panel' : APP_CONFIG.TAGLINE}</div>
            </div>
          </Link>

          {/* Search + Nav */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <div className="relative">
              <input
                placeholder="Search vehicles, locations..."
                className="field w-80 pl-10 pr-4"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</div>
            </div>

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
                    <NavItem to={ROUTES.PROFILE} label="Profile" />
                    <NavItem to={ROUTES.MY_BOOKINGS} label="My Bookings" />
                    <NavItem to={ROUTES.BOOKING} label="Book" />
                    <NavItem to={ROUTES.FAVORITES} label="Favorites ❤️" />
                  </>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  {isAuthenticated && <NotificationBell />}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-black">{(user?.name || 'U').charAt(0)}</div>
                    <div className="text-sm text-black">{user?.name}</div>
                  </div>
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
          </div>

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
          <div className="border-t border-gray-200 bg-white md:hidden">
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
                        to={ROUTES.PROFILE}
                        label="Profile"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.MY_BOOKINGS}
                        label="My Bookings"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.BOOKING}
                        label="Book"
                        onClick={() => setOpen(false)}
                      />
                      <NavItem
                        to={ROUTES.FAVORITES}
                        label="Favorites ❤️"
                        onClick={() => setOpen(false)}
                      />
                    </>
                  )}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-sm text-text-secondary mb-2">{user?.name}</div>
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

      <main className="py-8">
        <Outlet />
      </main>

      <footer className="mt-12 bg-white/30">
        <div className="container-page py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="font-display text-lg font-bold text-text-primary">{APP_CONFIG.NAME}</div>
              <p className="mt-2 text-sm text-text-secondary">Premium vehicles, clear pricing, delightful service.</p>
              <div className="mt-4 flex gap-3">
                <Link className="btn-primary" to={ROUTES.BOOKING}>Get Started</Link>
                <a className="btn-secondary" href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}>Contact Sales</a>
              </div>
            </div>
            <div className="text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Explore</div>
              <div className="mt-3 flex flex-col gap-2">
                <Link className="hover:text-slate-900" to={ROUTES.HOME}>Home</Link>
                <Link className="hover:text-slate-900" to={ROUTES.BOOKING}>Book</Link>
                <Link className="hover:text-slate-900" to={ROUTES.VEHICLES}>Vehicles</Link>
              </div>
            </div>
            <div className="text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Contact</div>
              <div className="mt-3">
                <div>{APP_CONFIG.SUPPORT_EMAIL}</div>
                <div className="mt-1">{APP_CONFIG.SUPPORT_HOURS}</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/20 pt-6 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.</div>
              <div className="flex gap-4">
              <Link className="hover:text-slate-900" to="/privacy">Privacy</Link>
              <Link className="hover:text-slate-900" to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
