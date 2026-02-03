import React, { useState } from "react";
import bus from "../image/mini-bus.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addUser, getUsers } from "../data/mockData";

import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (loginForm.password === "password123") {
      const users = await getUsers();

      const user =
        users.find((u) => u.email === loginForm.email) || {
          id: Date.now(),
          name: "User",
          email: loginForm.email,
          phone: "0000000000",
        };

      login(user);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } else {
      setError("Invalid email or password (use password123)");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const newUser = await addUser({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
      });

      login(newUser);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  /* ================= FORM ANIMATION ================= */
  const formVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === "login" ? -40 : 40,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === "login" ? 40 : -40,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="grid md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-indigo-600 to-emerald-500 p-10 text-white">
            <h1 className="text-3xl font-bold mt-6">Welcome 👋</h1>
            <p className="mt-3 text-sm">
              Login or create an account to continue booking vehicles.
            </p>

            <img
              src={bus}
              alt="Vehicle"
              className="mt-8 hidden md:block rounded-2xl"
            />
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Login" : "Register"}
            </h2>

            {/* TOGGLE */}
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`rounded-lg py-2 font-semibold transition ${
                  mode === "login"
                    ? "bg-white shadow"
                    : "text-slate-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`rounded-lg py-2 font-semibold transition ${
                  mode === "register"
                    ? "bg-white shadow"
                    : "text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* ================= FORMS WITH ANIMATION ================= */}
            <div className="relative mt-6 overflow-hidden">
              <AnimatePresence mode="wait" custom={mode}>
                {mode === "login" ? (
                  <motion.form
                    key="login"
                    custom="login"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border p-3"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full rounded-xl border p-3"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition">
                      Login
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    custom="register"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full rounded-xl border p-3"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border p-3"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      className="w-full rounded-xl border p-3"
                      value={registerForm.phone}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          phone: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full rounded-xl border p-3"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 transition">
                      Create Account
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
