import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VEHICLE_PRICES, VEHICLE_TYPES } from '../../constants/appConstants';
import { validateBookingForm } from '../../utils/validation';
import { calculateBookingPrice, formatPrice } from '../../utils/priceUtils';
import { getMinDate } from '../../utils/dateUtils';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * Booking Component
 * Handles vehicle booking form with validation
 */
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
    deliverDate: '',
    returnDate: '',
    deliverLocation: '',
    returnLocation: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Auto-update price when vehicle changes
    if (name === 'vehicle' && value) {
      newFormData.price = VEHICLE_PRICES[value] || 0;
    }

    setFormData(newFormData);

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Calculate price
    const priceBreakdown = calculateBookingPrice(
      VEHICLE_PRICES[formData.vehicle],
      formData.deliverDate,
      formData.returnDate
    );

    // Navigate to summary with booking data
    navigate('/summary', {
      state: {
        ...formData,
        price: VEHICLE_PRICES[formData.vehicle],
        ...priceBreakdown,
      },
    });
  };

  const vehicleOptions = Object.entries(VEHICLE_TYPES).map(([key, value]) => ({
    value,
    label: `${value} - ${formatPrice(VEHICLE_PRICES[value])}/day`,
  }));

  const priceBreakdown =
    formData.vehicle && formData.deliverDate && formData.returnDate
      ? calculateBookingPrice(
          VEHICLE_PRICES[formData.vehicle],
          formData.deliverDate,
          formData.returnDate
        )
      : null;

  return (
    <div className="py-12">
      <div className="container-page">
        <Card className="mx-auto max-w-4xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Vehicle Booking
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill in your details to book a vehicle
            </p>
          </div>

          {Object.keys(errors).length > 0 && errors.dates && (
            <Alert variant="error" className="mb-6">
              {errors.dates}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <Input
              label="Customer Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              error={errors.name}
            />

            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              error={errors.phone}
            />

            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="25"
              required
              error={errors.age}
              min="18"
              max="60"
            />

            <Input
              label="Driving License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL12345678901234"
              required
              error={errors.licenseNumber}
            />

            <Input
              label="Number of Persons"
              name="persons"
              type="number"
              value={formData.persons}
              onChange={handleChange}
              placeholder="4"
              required
              error={errors.persons}
              min="4"
            />

            <Select
              label="Vehicle Type"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              options={vehicleOptions}
              placeholder="Select Vehicle"
              required
              error={errors.vehicle}
            />

            <Input
              label="Pickup Date"
              name="deliverDate"
              type="date"
              value={formData.deliverDate}
              onChange={handleChange}
              required
              min={getMinDate()}
            />

            <Input
              label="Return Date"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              required
              min={formData.deliverDate || getMinDate()}
            />

            <Input
              label="Pickup Location"
              name="deliverLocation"
              value={formData.deliverLocation}
              onChange={handleChange}
              placeholder="Surat"
              required
            />

            <Input
              label="Drop Location"
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleChange}
              placeholder="Ahmedabad"
              required
            />

            {/* Price Preview */}
            {priceBreakdown && (
              <div className="md:col-span-2">
                <Card variant="brand" className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-brand-700">
                        Price per day
                      </div>
                      <div className="mt-1 text-2xl font-bold text-brand-900">
                        {formatPrice(priceBreakdown.pricePerDay)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-brand-700">
                        {priceBreakdown.days} day{priceBreakdown.days > 1 ? 's' : ''}
                      </div>
                      <div className="mt-1 text-lg text-brand-600">
                        Total: {formatPrice(priceBreakdown.total)}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'View Summary →'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
