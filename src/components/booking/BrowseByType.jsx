import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Browse By Type Component
 * Display vehicles categorized by type (Sedan, SUV, Mini Bus, etc.)
 */
export default function BrowseByType() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Mock vehicle data organized by type
  const vehiclesByType = {
    SEDAN: [
      { id: 1, name: 'Toyota Camry', price: 2000, description: 'Comfortable sedan for daily commute', image: '🚗', passengers: 5, fuel: 'Petrol' },
      { id: 2, name: 'Honda Civic', price: 1800, description: 'Fuel-efficient and reliable', image: '🚗', passengers: 5, fuel: 'Petrol' },
      { id: 5, name: 'Maruti Swift', price: 1600, description: 'Compact city car for solo travelers', image: '🚗', passengers: 4, fuel: 'Petrol' },
    ],
    SUV: [
      { id: 3, name: 'Mahindra XUV500', price: 3000, description: 'Spacious SUV with comfort features', image: '🚙', passengers: 7, fuel: 'Diesel' },
      { id: 4, name: 'Toyota Fortuner', price: 3500, description: 'Premium SUV for family trips', image: '🚙', passengers: 7, fuel: 'Diesel' },
      { id: 7, name: 'Hyundai Creta', price: 2500, description: 'Modern compact SUV with tech features', image: '🚙', passengers: 5, fuel: 'Petrol' },
    ],
    MINI_BUS: [
      { id: 6, name: 'Tempo Traveller', price: 3000, description: 'Comfortable 12-seater minibus', image: '🚌', passengers: 12, fuel: 'Diesel' },
      { id: 9, name: 'Mini Bus AC', price: 3500, description: 'Air-conditioned mini bus for groups', image: '🚌', passengers: 10, fuel: 'Diesel' },
    ],
  };

  const types = [
    { key: 'SEDAN', label: 'Sedans', icon: '🚗' },
    { key: 'SUV', label: 'SUVs', icon: '🚙' },
    { key: 'MINI_BUS', label: 'Mini Bus', icon: '🚌' },
  ];

  const toggleFavorite = (vehicleId) => {
    setFavorites((prev) => 
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  const handleBook = (vehicle) => {
    navigate(ROUTES.BOOKING);
  };

  const displayedVehicles = selectedType ? vehiclesByType[selectedType] : [];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">
            Browse by Vehicle Type
          </h1>
          <p className="mt-2 text-slate-600">
            Find the perfect vehicle for your journey
          </p>
        </div>

        {/* Type Selection */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {types.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(selectedType === type.key ? null : type.key)}
              className={`card p-6 text-center cursor-pointer transition ${
                selectedType === type.key
                  ? 'border-2 border-brand-600 bg-brand-50'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="font-semibold text-slate-900">{type.label}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {vehiclesByType[type.key]?.length || 0} vehicles
              </p>
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        {selectedType ? (
          displayedVehicles.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6 text-slate-900">
                {types.find((t) => t.key === selectedType)?.label}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
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
                        <Button onClick={() => handleBook(vehicle)}>Book</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="py-12 text-center">
              <p className="text-slate-600">No vehicles found in this category</p>
            </Card>
          )
        ) : (
          <Card className="py-12 text-center">
            <div className="text-4xl mb-4">👆</div>
            <h3 className="font-semibold text-slate-900">Select a vehicle type to browse</h3>
            <p className="mt-2 text-slate-600">Choose a category to see available vehicles</p>
          </Card>
        )}

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
