import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookingAPI from '../services/bookingAPI';
import Preloader from '../components/common/Preloader';

const vehiclePrices = {
  Sedan: 2000,
  SUV: 3000,
  "Mini Bus": 4500,
};

// helper that tries to guess a price per day based on available data
const inferPrice = ({ price, persons, vehicle }) => {
  if (price && price > 0) return price;
  const p = Number(persons) || 0;
  if (p >= 30) return 5200;
  if (p >= 12) return 3600;
  if (p >= 7) return 3000;
  if (p >= 4) return 2000;
  if (vehicle) {
    // normalize vehicle string for lookup
    const key = vehicle.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    return vehiclePrices[key] || 0;
  }
  return 0;
};

/* ---------- VEHICLE + LOWER PRICE BY PERSONS ---------- */
const getVehicleAndPrice = (persons) => {
  const p = Number(persons);

  if (p >= 30) return { vehicle: 'Mini Bus', price: 5200 };
  if (p >= 12) return { vehicle: 'Tempo Traveller', price: 3600 };
  if (p >= 7) return { vehicle: 'SUV', price: 3000 };
  if (p >= 4) return { vehicle: 'Sedan', price: 2000 };
  return { vehicle: 'Mini Car', price: 1500 };
};

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: "",
    licenseNumber: "",
    persons: "",
    vehicle: "",
    vehicleId: null, // store selected vehicle's database id
    price: 0,
    deliverDate: "",
    returnDate: "",
    deliverLocation: "",
    returnLocation: "",
  });

  // Auto-fill form with selected vehicle and user data
  useEffect(() => {
    const selectedVehicle = location.state?.selectedVehicle;
    
    if (user || selectedVehicle) {
      const persons = selectedVehicle ? selectedVehicle.passengers?.toString() : formData.persons;
      const vehicleLabel = selectedVehicle ? (selectedVehicle.type || selectedVehicle.vehicle_type || selectedVehicle.name) : formData.vehicle;
      const startingPrice = selectedVehicle ? selectedVehicle.price : formData.price;

      setFormData(prevData => ({
        ...prevData,
        name: user?.name || prevData.name,
        phone: user?.phone || user?.phone_number || prevData.phone,
        persons: selectedVehicle ? selectedVehicle.passengers?.toString() || prevData.persons : prevData.persons,
        vehicle: vehicleLabel || prevData.vehicle,
        vehicleId: selectedVehicle ? selectedVehicle.id : prevData.vehicleId,
        price: inferPrice({ price: startingPrice, persons, vehicle: vehicleLabel }) || prevData.price,
      }));
    }
  }, [user, location.state, formData.persons, formData.price, formData.vehicle]);

  // keep a live copy of the form in sessionStorage so confirmation page
  // has something even if user jumps directly or refreshes
  useEffect(() => {
    try {
      sessionStorage.setItem('bookingData', JSON.stringify(formData));
    } catch (e) {
      // ignore storage failures
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedVehicle = location.state?.selectedVehicle;
    let updated = { ...formData, [name]: value };

    // Auto set vehicle & price by persons (only if no vehicle is pre-selected)
    if (name === "persons") {
      if (value && !selectedVehicle) {
        const result = getVehicleAndPrice(value) || { vehicle: '', price: 0 };
        const { vehicle, price } = result;
        updated.vehicle = vehicle;
        updated.price = price;
      } else if (!value && !selectedVehicle) {
        // Clear auto-selected vehicle/price when persons is emptied
        updated.vehicle = '';
        updated.price = 0;
      }
    }

    // auto price update when vehicle changes (only if no specific vehicle was pre-selected)
    if (name === "vehicle") {
      const basePrice = selectedVehicle ? selectedVehicle.price : vehiclePrices[value] || updated.price;
      updated.price = inferPrice({ price: basePrice, persons: updated.persons, vehicle: updated.vehicle });
    }

    // also recalc price any time persons or vehicle changes
    if (name === 'persons' && updated.persons) {
      updated.price = inferPrice({ price: updated.price, persons: updated.persons, vehicle: updated.vehicle });
    }

    setFormData(updated);
  };

  // check availability when dates/vehicle change
  useEffect(() => {
    if (formData.vehicleId && formData.deliverDate && formData.returnDate) {
      // avoid checking overlapping automatically when not both dates are set
      bookingAPI.checkAvailability(formData.vehicleId, formData.deliverDate, formData.returnDate)
        .then(res => {
          if (res && !res.available) {
            alert(res.error || 'Selected vehicle is not available for these dates');
          }
        })
        .catch(err => {
          console.error('availability check failed', err);
        });
    }
  }, [formData.vehicleId, formData.deliverDate, formData.returnDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Validations
    if (formData.age < 18) {
      setIsSubmitting(false);
      return alert("❌ Age must be 18 or above");
    }

    if (formData.age > 60) {
      setIsSubmitting(false);
      return alert("❌ Booking not allowed above age 60");
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setIsSubmitting(false);
      return alert("❌ Enter valid 10-digit mobile number");
    }

    if (formData.licenseNumber.length < 15) {
      setIsSubmitting(false);
      return alert("❌ Invalid driving license number");
    }

    if (formData.persons < 4) {
      setIsSubmitting(false);
      return alert("❌ Minimum 4 persons required");
    }

    if (!formData.vehicle && !location.state?.selectedVehicle) {
      setIsSubmitting(false);
      return alert("❌ Please select a vehicle");
    }

    if (formData.deliverDate >= formData.returnDate) {
      setIsSubmitting(false);
      return alert("❌ Return date must be after pickup date");
    }

    // check availability again before proceeding
    if (formData.vehicleId && formData.deliverDate && formData.returnDate) {
      try {
        const avail = await bookingAPI.checkAvailability(formData.vehicleId, formData.deliverDate, formData.returnDate);
        if (avail && !avail.available) {
          setIsSubmitting(false);
          return alert(avail.error || 'Selected vehicle unavailable for those dates');
        }
      } catch (e) {
        console.error('availability check failed on submit', e);
        // backend will still enforce, so continue
      }
    }

    // Ensure a vehicle value is passed to summary (use selectedVehicle fallbacks)
    let outState = { ...formData };

    // if vehicle not set and we came from a selectedVehicle, copy it
    if (!outState.vehicle && location.state?.selectedVehicle) {
      const sv = location.state.selectedVehicle;
      outState.vehicle = sv.type || sv.vehicle_type || sv.name || '';
      outState.vehicleId = sv.id; // ensure id is carried
      outState.price = outState.price || sv.price || vehiclePrices[sv.type || sv.vehicle_type || sv.name] || outState.price;
    }

    // final sanity: infer price from whatever data we have
    outState.price = inferPrice({ price: outState.price, persons: outState.persons, vehicle: outState.vehicle });

    // save booking data locally so later screens (confirmation) can recover it if needed
    try {
      sessionStorage.setItem('bookingData', JSON.stringify(outState));
    } catch (e) {
      console.warn('failed to save bookingData to sessionStorage', e);
    }
    // 🔗 navigate to summary page (preloader will stay visible)
    navigate("/summary", { state: outState });
  };

  return (
    <>
      <Preloader isVisible={isSubmitting} message="Verifying your details..." />
      <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-4xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black">Vehicle Booking</h2>
            <p className="mt-2 text-sm text-gray-700">Fill in your details to book a vehicle</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Customer Name</label>
              <input
                name="name"
                className="field mt-2"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input
                name="phone"
                className="field mt-2"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                name="age"
                className="field mt-2"
                placeholder="25"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Driving License Number</label>
              <input
                name="licenseNumber"
                className="field mt-2"
                placeholder="DL12345678901234"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Number of Persons</label>
              <input
                type="number"
                name="persons"
                className="field mt-2"
                placeholder="4"
                value={formData.persons}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Vehicle Type</label>
              {location.state?.selectedVehicle ? (
                <input
                  type="text"
                  className="field mt-2 bg-gray-100"
                  value={`${location.state.selectedVehicle.name} (${location.state.selectedVehicle.type || location.state.selectedVehicle.vehicle_type || ''})`}
                  readOnly
                />
              ) : (
                <select name="vehicle" className="field mt-2" value={formData.vehicle} onChange={handleChange} required>
                  <option value="">Select Vehicle</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Mini Bus</option>
                </select>
              )}
            </div>
            {/* display price per day even before dates selected */}
            {formData.price > 0 && (
              <div className="md:col-span-2 mt-2">
                <span className="text-sm text-slate-600">Price per day:&nbsp;</span>
                <span className="font-medium text-slate-900">₹{formData.price}</span>
              </div>
            )}
            <div>
              <label className="label">Pickup Date</label>
              <input
                type="date"
                name="deliverDate"
                className="field mt-2"
                value={formData.deliverDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Return Date</label>
              <input
                type="date"
                name="returnDate"
                className="field mt-2"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Pickup Location</label>
              <input
                name="deliverLocation"
                className="field mt-2"
                placeholder="Surat"
                value={formData.deliverLocation}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Drop Location</label>
              <input
                name="returnLocation"
                className="field mt-2"
                placeholder="Ahmedabad"
                value={formData.returnLocation}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price Preview */}
            {formData.price > 0 && formData.deliverDate && formData.returnDate && (
              <div className="md:col-span-2 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-brand-700">Price per day</div>
                    <div className="mt-1 text-2xl font-bold text-brand-900">₹{formData.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-brand-700">
                      {Math.ceil((new Date(formData.returnDate) - new Date(formData.deliverDate)) / (1000 * 60 * 60 * 24))} days
                    </div>
                    <div className="mt-1 text-lg text-brand-600">
                      Total: ₹{formData.price * Math.ceil((new Date(formData.returnDate) - new Date(formData.deliverDate)) / (1000 * 60 * 60 * 24))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/")} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                View Summary →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
