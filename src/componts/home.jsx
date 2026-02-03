import { Link } from "react-router-dom";
import Cars from "../image/car.png";
export default function Home() {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(60%_50%_at_20%_10%,rgba(16,185,129,0.45),transparent_55%),radial-gradient(50%_50%_at_85%_35%,rgba(34,211,238,0.25),transparent_60%)]" />
        <div className="relative">
          <div className="container-page py-16 md:py-20">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Verified vehicles • Transparent pricing
                </div>
                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Premium vehicle rentals,
                  <span className="text-emerald-300"> ready when you are</span>.
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/80">
                  Book in minutes with clear pricing, flexible dates, and reliable support—built for a smooth ride from start
                  to finish.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/booking" className="btn-primary">
                    Book now
                    <span aria-hidden>→</span>
                  </Link>
                  <Link to="/auth" className="btn-secondary">
                    Sign in
                  </Link>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { k: "4.9/5", v: "Avg rating" },
                    { k: "24/7", v: "Support" },
                    { k: "0", v: "Hidden fees" },
                  ].map((s) => (
                    <div key={s.v} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                      <div className="text-lg font-bold text-white">{s.k}</div>
                      <div className="mt-1 text-xs text-white/70">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-2xl" />
                <div className="card-glass relative overflow-hidden p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Featured</div>
                      <div className="mt-1 font-display text-xl font-bold text-slate-900">Comfort Sedan</div>
                      <div className="mt-1 text-sm text-slate-600">From ₹2000 / day</div>
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

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { t: "Insurance", d: "Included" },
                      { t: "Pickup", d: "Flexible" },
                      { t: "Payment", d: "Secure" },
                    ].map((it) => (
                      <div key={it.t} className="rounded-xl border border-slate-200/70 bg-white/70 p-3">
                        <div className="text-xs font-semibold text-slate-900">{it.t}</div>
                        <div className="mt-0.5 text-xs text-slate-600">{it.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= QUICK SEARCH ================= */}
            <div className="mt-10">
              <div className="card mx-auto max-w-5xl p-6">
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <label className="label">Pickup location</label>
                    <input className="field mt-2" placeholder="e.g. Surat, Ahmedabad" />
                  </div>
                  <div>
                    <label className="label">Pickup date</label>
                    <input type="date" className="field mt-2" />
                  </div>
                  <div>
                    <label className="label">Return date</label>
                    <input type="date" className="field mt-2" />
                  </div>
                  <div className="flex items-end">
                    <Link to="/booking" className="btn-primary w-full">
                      Search
                    </Link>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Tip: final pricing depends on vehicle type and duration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-14">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">Why GreenRide</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">Built for comfort and trust</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Everything you need for a premium rental experience—without complexity.
              </p>
            </div>
            <Link to="/booking" className="btn-secondary">
              Explore booking
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              { icon: "🚗", title: "Wide vehicle range", desc: "Sedan, SUV, Mini Bus & more—choose what fits your trip." },
              { icon: "💳", title: "Secure payments", desc: "UPI / Card / Cash options with a clean checkout flow." },
              { icon: "🛡️", title: "Verified & insured", desc: "Safety-first vehicles, maintenance checks and coverage." },
              { icon: "⏱️", title: "Fast support", desc: "Quick help when you need it—before and during the ride." },
            ].map((s) => (
              <div key={s.title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-lg">
                  {s.icon}
                </div>
                <div className="mt-4 font-semibold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm text-slate-600">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-14 bg-white">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Vehicle categories</h2>
          <p className="mt-2 text-sm text-slate-600">Pick the right ride for city travel, family trips, or group tours.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              { name: "Sedan", sub: "Comfort & mileage", badge: "Popular" },
              { name: "SUV", sub: "Space & power", badge: "Premium" },
              { name: "Mini Bus", sub: "Group travel", badge: "Best for family" },
              { name: "Maxi Cab", sub: "Big groups", badge: "Tours" },
            ].map((c) => (
              <div key={c.name} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{c.badge}</div>
                </div>
                <div className="mt-3 text-sm text-slate-600">{c.sub}</div>
                <div className="mt-6">
                  <Link to="/booking" className="btn-ghost px-0 py-0 text-brand-700 hover:bg-transparent">
                    View options <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-14">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-5">
            {[
              { n: "01", t: "Choose", d: "Select vehicle & dates" },
              { n: "02", t: "Details", d: "Pickup & drop info" },
              { n: "03", t: "Verify", d: "License & basics" },
              { n: "04", t: "Pay", d: "Secure checkout" },
              { n: "05", t: "Ride", d: "Enjoy the trip" },
            ].map((s) => (
              <div key={s.n} className="card p-5">
                <div className="text-xs font-semibold text-slate-500">{s.n}</div>
                <div className="mt-2 font-semibold text-slate-900">{s.t}</div>
                <div className="mt-1 text-sm text-slate-600">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-14">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-emerald-500 p-10 text-white shadow-lift">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">Ready to book your ride?</h2>
                <p className="mt-2 text-white/90">Start a booking and confirm in minutes.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/booking" className="btn-secondary">
                  Book now
                </Link>
                <Link to="/auth" className="btn-ghost bg-white/10 text-white hover:bg-white/15">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
