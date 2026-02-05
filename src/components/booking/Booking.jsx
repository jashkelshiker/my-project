import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateBookingForm } from '../../utils/validation';
import { calculateBookingPrice, formatPrice } from '../../utils/priceUtils';
import { getMinDate } from '../../utils/dateUtils';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/* ---------- VEHICLE + LOWER PRICE BY PERSONS ---------- */
const getVehicleAndPrice = (persons) => {
  const p = Number(persons);

  if (p >= 20) return { vehicle: 'Mini Bus', price: 5200 };
  if (p >= 12) return { vehicle: 'Tempo Traveller', price: 3600 };
  if (p >= 7) return { vehicle: 'Sedan', price: 2600 };
  if (p >= 4) return { vehicle: 'Mini Car', price: 2000 };
  return { vehicle: '', price: 0 };
};

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: '',
    licenseNumber: '',
    persons: '',
    vehicle: '',
    price: 0,
    deliverDate: '',
    returnDate: '',
    deliverLocation: '',
    returnLocation: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- AUTO FILL USER ---------- */
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // Auto set vehicle & price by persons
    if (name === 'persons') {
      if (value) {
        const result = getVehicleAndPrice(value) || { vehicle: '', price: 0 };
        const { vehicle, price } = result;
        updated.vehicle = vehicle;
        updated.price = price;
      } else {
        // Clear auto-selected vehicle/price when persons is emptied
        updated.vehicle = '';
        updated.price = 0;
      }
    }

    setFormData(updated);

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const priceBreakdown = calculateBookingPrice(
      formData.price,
      formData.deliverDate,
      formData.returnDate
    );

    navigate('/summary', {
      state: {
        ...formData,
        ...priceBreakdown,
      },
    });
  };

  const priceBreakdown =
    formData.vehicle &&
    formData.deliverDate &&
    formData.returnDate
      ? calculateBookingPrice(
          formData.price,
          formData.deliverDate,
          formData.returnDate
        )
      : null;

  /* ---------- UI ---------- */
  return (
    <div className="py-12">
      <div className="container-page">
        <Card className="mx-auto max-w-4xl p-8">
          <h2 className="text-3xl font-bold mb-6">
            Vehicle Booking
          </h2>

          {errors.dates && (
            <Alert variant="error" className="mb-4">
              {errors.dates}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <Input label="Customer Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Age" name="age" type="number" min="18" value={formData.age} onChange={handleChange} required />
            <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />

            <Input
              label="Number of Persons"
              name="persons"
              type="number"
              value={formData.persons}
              onChange={handleChange}
              required
            />

            {/* Auto-selected vehicle */}
            <Input
              label="Vehicle (Auto Selected)"
              value={formData.vehicle}
              disabled
            />

            <Input label="Pickup Date" type="date" name="deliverDate" min={getMinDate()} value={formData.deliverDate} onChange={handleChange} required />
            <Input label="Return Date" type="date" name="returnDate" min={formData.deliverDate || getMinDate()} value={formData.returnDate} onChange={handleChange} required />
            <Input label="Pickup Location" name="deliverLocation" value={formData.deliverLocation} onChange={handleChange} required />
            <Input label="Drop Location" name="returnLocation" value={formData.returnLocation} onChange={handleChange} required />

            {priceBreakdown && (
              <div className="md:col-span-2">
                <Card variant="brand" className="p-4 flex justify-between">
                  <div>
                    <p className="text-sm">Price / Day</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(priceBreakdown.pricePerDay)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{priceBreakdown.days} Days</p>
                    <p className="text-lg font-semibold">
                      Total: {formatPrice(priceBreakdown.total)}
                    </p>
                  </div>
                </Card>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                View Summary →
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
