import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/appConstants';
import { formatPrice } from '../../utils/priceUtils';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Favorites Component
 * Displays all favorite vehicles saved by the user
 */
export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  /* ---------- LOAD FAVORITES FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    setLoading(true);
    const saved = localStorage.getItem('favoriteVehicles');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
    setLoading(false);
  }, []);

  /* ---------- REMOVE FROM FAVORITES ---------- */
  const removeFavorite = (vehicleId) => {
    const updated = favorites.filter((f) => f.id !== vehicleId);
    setFavorites(updated);
    localStorage.setItem('favoriteVehicles', JSON.stringify(updated));
  };

  /* ---------- CLEAR ALL FAVORITES ---------- */
  const clearAllFavorites = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favoriteVehicles');
    setShowConfirmDialog(false);
  };

  /* ---------- CALCULATE TOTAL VALUE ---------- */
  const totalValue = favorites.reduce((sum, v) => sum + (v.price || 0), 0);
  const avgPrice = favorites.length > 0 ? totalValue / favorites.length : 0;

  if (loading) {
    return (
      <div className="py-12 bg-slate-50">
        <div className="container-page">
          <Card className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-slate-600">Loading favorites...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container-page">
        {/* ---------- HEADER ---------- */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              ❤️ My Favorite Vehicles
            </h1>
            <p className="mt-2 text-slate-600">
              {favorites.length === 0
                ? 'You haven\'t added any favorites yet'
                : `${favorites.length} vehicle${favorites.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              onClick={() => navigate(ROUTES.VEHICLES)}
              variant="secondary"
              className="mt-4 md:mt-0"
            >
              Browse More Vehicles
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          /* ---------- EMPTY STATE ---------- */
          <Card className="py-16 text-center">
            <div className="text-6xl mb-4">🤍</div>
            <h3 className="text-2xl font-bold text-slate-900">No favorites yet</h3>
            <p className="mt-4 text-slate-600 mb-8 max-w-md mx-auto">
              Start exploring our vehicle collection and add your favorites for quick booking later!
            </p>
              <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate(ROUTES.VEHICLES)}>
                Browse Vehicles
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.BOOKING)}>
                Make a Booking
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* ---------- STATS ---------- */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card className="px-6 py-4 border-l-4 border-l-red-400">
                <div className="text-sm font-medium text-slate-600">Total Favorites</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{favorites.length}</div>
              </Card>
              <Card className="px-6 py-4 border-l-4 border-l-brand-400">
                <div className="text-sm font-medium text-slate-600">Average Price</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {formatPrice(avgPrice)}/day
                </div>
              </Card>
              <Card className="px-6 py-4 border-l-4 border-l-emerald-400">
                <div className="text-sm font-medium text-slate-600">Total Value (Daily)</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">
                  {formatPrice(totalValue)}/day
                </div>
              </Card>
            </div>

            {/* ---------- FAVORITES GRID ---------- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Vehicle Image Area */}
                  <div className="relative bg-gradient-to-br from-red-50 to-rose-50 p-8 text-center">
                    <div className="text-6xl mb-4">{vehicle.image || '🚗'}</div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFavorite(vehicle.id)}
                      className="absolute top-4 right-4 text-2xl transition-transform hover:scale-110 text-red-500"
                      title="Remove from favorites"
                    >
                      ❤️
                    </button>

                    {/* Type Badge */}
                    <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
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
                          {formatPrice(vehicle.price)}/day
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(ROUTES.BOOKING)}
                        className="flex-shrink-0"
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ---------- ACTION BUTTONS ---------- */}
            <div className="mt-8 flex gap-3 justify-between">
              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.VEHICLES)}
              >
                ← Browse More
              </Button>
              <Button
                variant="danger"
                onClick={clearAllFavorites}
              >
                Clear All Favorites
              </Button>
            </div>
          </>
        )}

        {/* ---------- CONFIRMATION DIALOG ---------- */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Clear All Favorites?
                </h2>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to clear all favorites? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={confirmClearFavorites}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
