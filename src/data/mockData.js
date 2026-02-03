// Mock data for the application
// In a real app, this would come from an API

export const mockVehicles = [
  {
    id: 1,
    name: 'Sedan',
    type: 'Sedan',
    model: 'Honda City',
    price: 2000,
    seats: 5,
    available: true,
    image: '/car.png',
    description: 'Comfortable sedan perfect for city travel',
  },
  {
    id: 2,
    name: 'SUV',
    type: 'SUV',
    model: 'Toyota Fortuner',
    price: 3000,
    seats: 7,
    available: true,
    image: '/car.png',
    description: 'Spacious SUV for family trips',
  },
  {
    id: 3,
    name: 'Mini Bus',
    type: 'Mini Bus',
    model: 'Tata Winger',
    price: 6000,
    seats: 12,
    available: true,
    image: '/mini-bus.png',
    description: 'Perfect for group travel',
  },
  {
    id: 4,
    name: 'Maxi Cab',
    type: 'Maxi Cab',
    model: 'Force Traveller',
    price: 4500,
    seats: 18,
    available: false,
    image: '/mini-bus.png',
    description: 'Large capacity for tours and events',
  },
];

export const mockBookings = [
  {
    id: 1,
    userId: 2,
    userName: 'John Doe',
    vehicleId: 1,
    vehicleName: 'Sedan',
    pickupDate: '2026-02-05',
    returnDate: '2026-02-07',
    pickupLocation: 'Surat',
    dropLocation: 'Ahmedabad',
    totalPrice: 4000,
    status: 'confirmed',
    createdAt: '2026-01-28',
  },
  {
    id: 2,
    userId: 3,
    userName: 'Jane Smith',
    vehicleId: 2,
    vehicleName: 'SUV',
    pickupDate: '2026-02-10',
    returnDate: '2026-02-12',
    pickupLocation: 'Mumbai',
    dropLocation: 'Pune',
    totalPrice: 6000,
    status: 'pending',
    createdAt: '2026-01-29',
  },
];

export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@greenride.com',
    phone: '9876543210',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543211',
    role: 'user',
    createdAt: '2026-01-15',
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543212',
    role: 'user',
    createdAt: '2026-01-20',
  },
];

// Helper functions to manage data (simulating API calls)
let vehicles = [...mockVehicles];
let bookings = [...mockBookings];
let users = [...mockUsers];

export const getVehicles = () => Promise.resolve([...vehicles]);
export const addVehicle = (vehicle) => {
  const newVehicle = { ...vehicle, id: Date.now(), available: true };
  vehicles.push(newVehicle);
  return Promise.resolve(newVehicle);
};
export const updateVehicle = (id, updates) => {
  vehicles = vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v));
  return Promise.resolve(vehicles.find((v) => v.id === id));
};
export const deleteVehicle = (id) => {
  vehicles = vehicles.filter((v) => v.id !== id);
  return Promise.resolve();
};

export const getBookings = () => Promise.resolve([...bookings]);
export const addBooking = (booking) => {
  const newBooking = { ...booking, id: Date.now(), status: 'pending', createdAt: new Date().toISOString().split('T')[0] };
  bookings.push(newBooking);
  return Promise.resolve(newBooking);
};
export const updateBookingStatus = (id, status) => {
  bookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  return Promise.resolve(bookings.find((b) => b.id === id));
};

export const getUsers = () => Promise.resolve([...users]);
export const addUser = (userData) => {
  const newUser = { ...userData, id: Date.now(), role: 'user', createdAt: new Date().toISOString().split('T')[0] };
  users.push(newUser);
  return Promise.resolve(newUser);
};
