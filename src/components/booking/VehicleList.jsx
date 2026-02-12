import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Vehicle List Component
 * Displays all available vehicles with favorite button
 */
export default function VehicleList() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  /* ---------- LOAD FAVORITES FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('favoriteVehicles');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  /* ---------- MOCK VEHICLES DATA ---------- */
  const vehicles = [
    {
      id: 1,
      name: 'Toyota Camry',
      type: VEHICLE_TYPES.SEDAN,
      price: 2000,
      description: 'Comfortable sedan for daily commute',
      image: '🚗',
      passengers: 5,
      fuel: 'Petrol',
    },
    {
      id: 2,
      name: 'Honda Civic',
      type: VEHICLE_TYPES.SEDAN,
      price: 1800,
      description: 'Fuel-efficient and reliable',
      image: '🚗',
      passengers: 5,
      fuel: 'Petrol',
    },
    {
      id: 3,
      name: 'Mahindra XUV500',
      type: VEHICLE_TYPES.SUV,
      price: 3000,
      description: 'Spacious SUV with comfort features',
      image: '🚙',
      passengers: 7,
      fuel: 'Diesel',
    },
    {
      id: 4,
      name: 'Toyota Fortuner',
      type: VEHICLE_TYPES.SUV,
      price: 3500,
      description: 'Premium SUV for family trips',
      image: '🚙',
      passengers: 7,
      fuel: 'Diesel',
    },
    {
      id: 5,
      name: 'Maruti Swift',
      type: VEHICLE_TYPES.SEDAN,
      price: 1600,
      description: 'Compact city car for solo travelers',
      image: '🚗',
      passengers: 4,
      fuel: 'Petrol',
    },
    {
      id: 6,
      name: 'Tempo Traveller',
      type: VEHICLE_TYPES.MINI_BUS,
      price: 3000,
      description: 'Comfortable 12-seater minibus',
      image: '🚌',
      passengers: 12,
      fuel: 'Diesel',
    },
    {
      id: 7,
      name: 'Hyundai Creta',
      type: VEHICLE_TYPES.SUV,
      price: 2500,
      description: 'Modern compact SUV with tech features',
      image: '🚙',
      passengers: 5,
      fuel: 'Petrol',
    },
    {
      id: 8,
      name: 'Kia Carnival',
      type: VEHICLE_TYPES.MINI_BUS,
      price: 4000,
      description: 'Premium family minibus',
      image: '🚌',
      passengers: 8,
      fuel: 'Diesel',
    },
  ];

  /* ---------- FILTER VEHICLES ---------- */
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  /* ---------- TOGGLE FAVORITE ---------- */
  const toggleFavorite = (vehicle) => {
    const isFavorite = favorites.some((f) => f.id === vehicle.id);
    let updated;

    if (isFavorite) {
      updated = favorites.filter((f) => f.id !== vehicle.id);
    } else {
      updated = [...favorites, vehicle];
    }

    setFavorites(updated);
    localStorage.setItem('favoriteVehicles', JSON.stringify(updated));
  };

  /* ---------- CHECK IF FAVORITE ---------- */
  const isFavorite = (vehicleId) => {
    return favorites.some((f) => f.id === vehicleId);
  };

  return (
    <div className="py-12 bg-slate-50">
      <div className="container-page">
        {/* ---------- HEADER ---------- */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Our Vehicles
          </h1>
          <p className="mt-2 text-slate-600">
            Browse our collection of premium vehicles. Save your favorites for quick booking!
          </p>
        </div>

        {/* ---------- FAVORITES LINK ---------- */}
        {favorites.length > 0 && (
          <Button 
            onClick={() => navigate(ROUTES.FAVORITES)} 
            variant="secondary"
            className="mb-6"
          >
            ❤️ My Favorites ({favorites.length})
          </Button>
        )}

        {/* ---------- FILTERS ---------- */}
        <Card className="mb-8 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search vehicles
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="all">All Types</option>
                <option value={VEHICLE_TYPES.SEDAN}>Sedan</option>
                <option value={VEHICLE_TYPES.SUV}>SUV</option>
                <option value={VEHICLE_TYPES.MINI_BUS}>Mini Bus</option>
                <option value={VEHICLE_TYPES.MAXI_CAB}>Maxi Cab</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ---------- VEHICLE GRID ---------- */}
        {filteredVehicles.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-slate-900">No vehicles found</h3>
            <p className="mt-2 text-slate-600">Try adjusting your search or filter</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => {
              const isVehicleFavorite = isFavorite(vehicle.id);
              return (
                <Card
                  key={vehicle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Vehicle Image Area */}
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 p-8 text-center">
                    <div className="text-6xl mb-4">{vehicle.image}</div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(vehicle)}
                      className={`absolute top-4 right-4 text-2xl transition-transform hover:scale-110 ${
                        isVehicleFavorite ? 'text-red-500 scale-110' : 'text-slate-300 hover:text-red-500'
                      }`}
                      title={isVehicleFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isVehicleFavorite ? '❤️' : '🤍'}
                    </button>

                    {/* Type Badge */}
                    <div className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                      {vehicle.type}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {vehicle.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 flex-1">
                      {vehicle.description}
                    </p>

                    {/* Specs */}
                    <div className="mt-4 flex gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{vehicle.passengers} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⛽</span>
                        <span>{vehicle.fuel}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-600">From</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatPrice(vehicle.price)}
                        </p>
                        <p className="text-xs text-slate-600">per day</p>
                      </div>
                      <Button
                        onClick={() => navigate(ROUTES.BOOKING)}
                        className="flex-shrink-0"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
