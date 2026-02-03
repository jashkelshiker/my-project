import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const vehiclePrices = {
  Sedan: 2000,
  SUV: 3000,
  "Mini Bus": 4500,
  "Maxi Cab": 6000,
};

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    age: "",
    licenseNumber: "",
    persons: "",
    vehicle: "",
    price: 0,
    deliverDate: "",
    returnDate: "",
    deliverLocation: "",
    returnLocation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // auto price update when vehicle changes
    if (name === "vehicle") {
      setFormData({
        ...formData,
        vehicle: value,
        price: vehiclePrices[value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validations
    if (formData.age < 18)
      return alert("❌ Age must be 18 or above");

    if (formData.age > 60)
      return alert("❌ Booking not allowed above age 60");

    if (!/^\d{10}$/.test(formData.phone))
      return alert("❌ Enter valid 10-digit mobile number");

    if (formData.licenseNumber.length < 15)
      return alert("❌ Invalid driving license number");

    if (formData.persons < 4)
      return alert("❌ Minimum 4 persons required");

    if (!formData.vehicle)
      return alert("❌ Please select a vehicle");

    if (formData.deliverDate >= formData.returnDate)
      return alert("❌ Return date must be after pickup date");

    // 🔗 navigate to summary page
    navigate("/summary", { state: formData });
  };

  return (
    <div className="py-12">
      <div className="container-page">
        <div className="card mx-auto max-w-4xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Vehicle Booking</h2>
            <p className="mt-2 text-sm text-slate-600">Fill in your details to book a vehicle</p>
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
              <select name="vehicle" className="field mt-2" value={formData.vehicle} onChange={handleChange} required>
                <option value="">Select Vehicle</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Mini Bus</option>
                <option>Maxi Cab</option>
              </select>
            </div>
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
  );
}
