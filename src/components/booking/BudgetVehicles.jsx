import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Budget Vehicles Component
 * Display affordable vehicle options sorted by price
 */
export default function BudgetVehicles() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const budgetVehicles = [
    { id: 5, name: 'Maruti Swift', price: 1600, description: 'Compact city car for solo travelers', image: '🚗', passengers: 4, fuel: 'Petrol', savings: '20%' },
    { id: 2, name: 'Honda Civic', price: 1800, description: 'Fuel-efficient and reliable', image: '🚗', passengers: 5, fuel: 'Petrol', savings: '10%' },
    { id: 1, name: 'Toyota Camry', price: 2000, description: 'Comfortable sedan for daily commute', image: '🚗', passengers: 5, fuel: 'Petrol', savings: '15%' },
    { id: 7, name: 'Hyundai Creta', price: 2500, description: 'Modern compact SUV with tech features', image: '🚙', passengers: 5, fuel: 'Petrol', savings: '12%' },
  ];

  const toggleFavorite = (vehicleId) => {
    setFavorites((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 mb-4">
            💰 Budget Friendly Deals
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">
            Budget Vehicles
          </h1>
          <p className="mt-2 text-slate-600">
            Great quality at affordable prices - Save up to 20%
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Cheapest Option</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatPrice(1600)}/day</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Average Price</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatPrice(1975)}/day</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Total Options</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{budgetVehicles.length}</p>
          </Card>
        </div>

        {/* Vehicles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgetVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition flex flex-col relative">
              {/* Savings Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                Save {vehicle.savings}
              </div>

              <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 p-8 text-center pt-12">
                <div className="text-6xl mb-4">{vehicle.image}</div>
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="absolute top-4 right-4 text-2xl transition-transform hover:scale-110"
                >
                  {favorites.includes(vehicle.id) ? '❤️' : '🤍'}
                </button>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">{vehicle.name}</h3>
                <p className="mt-2 text-sm text-slate-600 flex-1">{vehicle.description}</p>

                <div className="mt-4 flex gap-4 text-sm text-slate-600">
                  <div>👥 {vehicle.passengers} seats</div>
                  <div>⛽ {vehicle.fuel}</div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600">From</p>
                    <p className="text-2xl font-bold text-slate-900">{formatPrice(vehicle.price)}/day</p>
                  </div>
                  <Button onClick={() => navigate(ROUTES.BOOKING)}>Book</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 p-8 text-white text-center">
          <h2 className="font-display text-2xl font-bold">Ready to save money?</h2>
          <p className="mt-2 text-white/90">Start your affordable journey today</p>
          <Button variant="secondary" className="mt-6" onClick={() => navigate(ROUTES.BOOKING)}>
            Book Now
          </Button>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
