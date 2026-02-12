import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Popular Vehicles Component
 * Display trending and most booked vehicles
 */
export default function PopularVehicles() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const popularVehicles = [
    { id: 1, name: 'Toyota Camry', price: 2000, description: 'Comfortable sedan for daily commute', image: '🚗', passengers: 5, fuel: 'Petrol', bookings: 1250, rating: 4.8 },
    { id: 3, name: 'Mahindra XUV500', price: 3000, description: 'Spacious SUV with comfort features', image: '🚙', passengers: 7, fuel: 'Diesel', bookings: 950, rating: 4.6 },
    { id: 6, name: 'Tempo Traveller', price: 3000, description: 'Comfortable 12-seater minibus', image: '🚌', passengers: 12, fuel: 'Diesel', bookings: 850, rating: 4.7 },
    { id: 4, name: 'Toyota Fortuner', price: 3500, description: 'Premium SUV for family trips', image: '🚙', passengers: 7, fuel: 'Diesel', bookings: 720, rating: 4.9 },
    { id: 7, name: 'Hyundai Creta', price: 2500, description: 'Modern compact SUV with tech features', image: '🚙', passengers: 5, fuel: 'Petrol', bookings: 680, rating: 4.5 },
    { id: 2, name: 'Honda Civic', price: 1800, description: 'Fuel-efficient and reliable', image: '🚗', passengers: 5, fuel: 'Petrol', bookings: 620, rating: 4.4 },
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
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 mb-4">
            🔥 Trending Now
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">
            Popular Vehicles
          </h1>
          <p className="mt-2 text-slate-600">
            Most loved and frequently booked by our customers
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Total Bookings</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">5,070+</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Avg Rating</div>
            <p className="mt-2 text-2xl font-bold text-yellow-500">⭐ 4.65/5</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-slate-600">Popular Options</div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{popularVehicles.length}</p>
          </Card>
        </div>

        {/* Vehicles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
              <div className="relative bg-gradient-to-br from-red-50 to-rose-50 p-8 text-center">
                <div className="text-6xl mb-4">{vehicle.image}</div>
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className="absolute top-4 right-4 text-2xl transition-transform hover:scale-110"
                >
                  {favorites.includes(vehicle.id) ? '❤️' : '🤍'}
                </button>

                {/* Rating Badge */}
                <div className="mt-4 inline-flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-sm">
                  <span>⭐</span>
                  <span className="font-bold">{vehicle.rating}</span>
                  <span className="text-xs text-slate-600">({vehicle.bookings} bookings)</span>
                </div>
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
