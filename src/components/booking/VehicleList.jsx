import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VEHICLE_TYPES, ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import vehicleAPI from '../../services/vehicleAPI';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Vehicle List Component
 * Displays all available vehicles from backend with favorite button
 */
export default function VehicleList() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /* ---------- LOAD VEHICLES FROM BACKEND ---------- */
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all active vehicles from backend
        const response = await vehicleAPI.getAllVehicles();
        const vehicleList = response.results || response;
        
        // Filter to only active vehicles
        const activeVehicles = vehicleList.filter(v => v.is_active !== false);
        setVehicles(activeVehicles);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
        setError('Failed to load vehicles. Please try again.');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  /* ---------- LOAD FAVORITES FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('favoriteVehicles');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavorites([]);
      }
    }
  }, []);


  /* ---------- FILTER VEHICLES ---------- */
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (v.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || v.vehicle_type === selectedType;
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

        {/* ---------- ERROR MESSAGE ---------- */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </Card>
        )}

        {/* ---------- LOADING STATE ---------- */}
        {loading && !error ? (
          <Card className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-slate-600">Loading vehicles...</p>
          </Card>
        ) : (
          <>
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
                className="field"
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
                className="field"
              >
                <option value="all">All Types</option>
                <option value={VEHICLE_TYPES.SEDAN}>Sedan</option>
                <option value={VEHICLE_TYPES.SUV}>SUV</option>
                <option value={VEHICLE_TYPES.MINI_BUS}>Mini Bus</option>
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
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 h-48 text-center flex items-center justify-center overflow-hidden">
                    {vehicle.photo ? (
                      <img 
                        src={vehicle.photo} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-6xl">🚗</div>
                    )}
                    
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
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                      {vehicle.vehicle_type || 'Vehicle'}
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
                        <span>{vehicle.passengers || 4} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⛽</span>
                        <span>{vehicle.fuel || 'Petrol'}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-600">From</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatPrice(vehicle.price_per_day || 0)}
                        </p>
                        <p className="text-xs text-slate-600">per day</p>
                      </div>
                      <Button
                        onClick={() => {
                          navigate(ROUTES.BOOKING, { state: { selectedVehicle: vehicle } });
                        }}
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
          </>
        )}
      </div>
  );
}
