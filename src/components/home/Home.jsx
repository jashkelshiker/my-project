import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Cars from "../../image/car.png";
import {
  ROUTES,
  APP_CONFIG,
  VEHICLE_TYPES,
  VEHICLE_PRICES,
} from "../../constants/appConstants";
import { formatPrice } from "../../utils/priceUtils";

/* ================= ANIMATION VARIANTS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* ================= COMPONENT ================= */

export default function Home() {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(60%_50%_at_20%_10%,rgba(16,185,129,0.45),transparent_55%),radial-gradient(50%_50%_at_85%_35%,rgba(34,211,238,0.25),transparent_60%)]" />

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="container-page py-16 md:py-20">
            <motion.div
              variants={containerStagger}
              initial="hidden"
              animate="visible"
              className="grid items-center gap-10 md:grid-cols-2"
            >
              {/* LEFT */}
              <div>
                <motion.div
                  variants={fadeUp}
                  custom={1}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Verified vehicles • Transparent pricing
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={2}
                  className="mt-6 font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
                >
                  Premium vehicle rentals,
                  <span className="text-emerald-300"> ready when you are</span>.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={3}
                  className="mt-4 max-w-xl text-base text-white/80"
                >
                  Book in minutes with clear pricing, flexible dates, and reliable
                  support—built for a smooth ride.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  custom={4}
                  className="mt-8 flex gap-3"
                >
                  <Link to={ROUTES.BOOKING} className="btn-primary">
                    Book now →
                  </Link>
                  <Link to={ROUTES.AUTH} className="btn-secondary">
                    Sign in
                  </Link>
                </motion.div>
              </div>

              {/* RIGHT CARD */}
              <motion.div
                variants={fadeUp}
                custom={5}
                className="relative"
              >
                <div className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-2xl" />
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="card-glass relative p-6"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        Featured
                      </div>
                      <div className="font-display text-xl font-bold text-slate-900">
                        Comfort Sedan
                      </div>
                      <div className="text-sm text-slate-600">
                        From{" "}
                        {formatPrice(
                          VEHICLE_PRICES[VEHICLE_TYPES.SEDAN]
                        )}{" "}
                        / day
                      </div>
                    </div>
                    <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      Best value
                    </div>
                  </div>

                  <img
                    src={Cars}
                    alt="Vehicle"
                    className="mt-6 w-full rounded-2xl bg-white p-4 shadow-lift"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-14">
        <div className="container-page">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-slate-900"
          >
            Why {APP_CONFIG.NAME}
          </motion.h2>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 md:grid-cols-4"
          >
            {[
              { icon: "🚗", title: "Wide vehicle range" },
              { icon: "💳", title: "Secure payments" },
              { icon: "🛡️", title: "Verified & insured" },
              { icon: "⏱️", title: "Fast support" },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="card p-6"
              >
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-3 font-semibold">{s.title}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-14 bg-white">
        <div className="container-page">
          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-4"
          >
            {[
              VEHICLE_TYPES.SEDAN,
              VEHICLE_TYPES.SUV,
              VEHICLE_TYPES.MINI_BUS,
              VEHICLE_TYPES.MAXI_CAB,
            ].map((v, i) => (
              <motion.div
                key={v}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.03 }}
                className="card p-6"
              >
                <div className="font-semibold">{v}</div>
                <Link
                  to={ROUTES.BOOKING}
                  className="btn-ghost mt-4 px-0"
                >
                  View options →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-14">
        <div className="container-page">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-brand-700 to-emerald-500 p-10 text-white shadow-lift"
          >
            <h2 className="font-display text-3xl font-bold">
              Ready to book your ride?
            </h2>
            <div className="mt-6 flex gap-3">
              <Link to={ROUTES.BOOKING} className="btn-secondary">
                Book now
              </Link>
              <Link
                to={ROUTES.AUTH}
                className="btn-ghost bg-white/10 text-white"
              >
                Create account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
