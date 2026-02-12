import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addUser, getUsers } from '../../data/mockData';
import { DEMO_CREDENTIALS, ROUTES, APP_CONFIG } from '../../constants/appConstants';
import { validateEmail } from '../../utils/validation';
import bus from '../../image/mini-bus.png';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * Auth Page Component
 * Handles user login and registration
 */
export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Trim whitespace from inputs
      const email = loginForm.email.trim();
      const password = loginForm.password.trim();

      // Demo login - in real app, this would be an API call
      if (
        email === DEMO_CREDENTIALS.ADMIN.EMAIL &&
        password === DEMO_CREDENTIALS.ADMIN.PASSWORD
      ) {
        login({
          id: 1,
          name: 'Admin User',
          email: DEMO_CREDENTIALS.ADMIN.EMAIL,
          phone: '9876543210',
          role: 'admin',
        });
        navigate(
          location.state?.from?.pathname || ROUTES.ADMIN_DASHBOARD,
          { replace: true }
        );
      } else if (password === DEMO_CREDENTIALS.USER.PASSWORD) {
        // Demo user login
        const users = await getUsers();

        const foundUser =
          users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
          {
            id: Date.now(),
            name: 'User',
            email: email,
            phone: '0000000000',
            role: 'user',
          };
        login(foundUser);
        navigate(
          location.state?.from?.pathname || ROUTES.DASHBOARD,
          { replace: true }
        );
      } else {
        setError(
          `Invalid email or password. Try: ${DEMO_CREDENTIALS.ADMIN.EMAIL} / ${DEMO_CREDENTIALS.ADMIN.PASSWORD} or any email / ${DEMO_CREDENTIALS.USER.PASSWORD}`
        );
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(registerForm.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await addUser({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        role: 'user',
      });

      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-page flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lift">
          <div className="grid md:grid-cols-2">
            {/* Brand panel */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-emerald-500 p-8 text-white md:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-emerald-200" />
                  {APP_CONFIG.NAME} • Vehicle Rental System
                </div>

                <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Welcome back.
                  <span className="text-white/90"> Let's get you moving.</span>
                </h1>
                <p className="mt-3 text-sm text-white/90">
                  Premium booking experience with role-based panels for users
                  and admins.
                </p>

                <ul className="mt-8 space-y-3 text-sm text-white/95">
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      ✓
                    </span>
                    Verified vehicles & transparent pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      ✓
                    </span>
                    Admin panel for vehicles, bookings & users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                      ✓
                    </span>
                    Smooth payment & confirmation flow
                  </li>
                </ul>

                <div className="mt-10 rounded-2xl bg-white/10 p-4 text-xs text-white/95">
                  <div className="font-semibold">Demo Credentials</div>
                  <div className="mt-2 grid gap-1">
                    <div>
                      <span className="font-semibold">Admin:</span>{' '}
                      {DEMO_CREDENTIALS.ADMIN.EMAIL} /{' '}
                      {DEMO_CREDENTIALS.ADMIN.PASSWORD}
                    </div>
                    <div>
                      <span className="font-semibold">User:</span> any email /{' '}
                      {DEMO_CREDENTIALS.USER.PASSWORD}
                    </div>
                  </div>
                </div>

                <img
                  src={bus}
                  alt="Vehicle"
                  className="mt-8 hidden w-full max-w-sm rounded-2xl bg-white/10 p-4 drop-shadow-xl md:block"
                />
              </div>
            </div>

            {/* Form panel */}
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
                    {mode === 'login' ? 'Login' : 'Register'}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {mode === 'login'
                      ? 'Access your dashboard in seconds.'
                      : 'Create your account to book vehicles.'}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === 'login'
                      ? 'bg-white shadow-soft text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === 'register'
                      ? 'bg-white shadow-soft text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create account
                </button>
              </div>

              {error && (
                <Alert variant="error" className="mt-6">
                  {error}
                </Alert>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    placeholder={DEMO_CREDENTIALS.ADMIN.EMAIL}
                    required
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder={`${DEMO_CREDENTIALS.ADMIN.PASSWORD} or ${DEMO_CREDENTIALS.USER.PASSWORD}`}
                    required
                  />
                  <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center text-sm text-slate-600">
                    New here?{' '}
                    <button
                      type="button"
                      className="font-semibold text-brand-700 hover:text-brand-800"
                      onClick={() => {
                        setMode('register');
                        setError('');
                      }}
                    >
                      Create an account
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                  <Input
                    label="Full name"
                    name="name"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                    required
                  />
                  <Input
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="9876543210"
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    placeholder={DEMO_CREDENTIALS.USER.PASSWORD}
                    required
                  />

                  <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>

                  <div className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="font-semibold text-brand-700 hover:text-brand-800"
                      onClick={() => {
                        setMode('login');
                        setError('');
                      }}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center text-xs text-slate-500">
                By continuing, you agree to our Terms & Privacy Policy (demo).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
