# GreenRide - Vehicle Rental Management System

## Complete System Overview

This is a full-featured Vehicle Rental Management System with **Admin Panel** and **User Panel**.

## Features

### 🎯 Admin Panel
- **Dashboard**: Overview with statistics (vehicles, bookings, users, revenue)
- **Vehicle Management**: Add, edit, delete vehicles (CRUD operations)
- **Booking Management**: View all bookings and update status (pending/confirmed/cancelled/completed)
- **User Management**: View all registered users

### 👤 User Panel
- **Dashboard**: View personal booking history
- **Booking Flow**: Complete booking process with validation
- **Payment**: Secure payment with multiple methods (UPI/Card/Cash)

## Quick Start

### Installation
```bash
npm install
npm start
```

### Demo Credentials

#### Admin Login
- **Email**: `admin@greenride.com`
- **Password**: `admin123`

#### User Login
- **Email**: Any email (e.g., `user@example.com`)
- **Password**: `password123`

#### Register New User
- Fill the registration form
- Default role: `user`
- Admin accounts require manual creation

## Routes

### Public Routes
- `/` - Home page
- `/booking` - Booking form
- `/auth` - Login/Register

### Protected User Routes
- `/dashboard` - User dashboard (requires login)

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/vehicles` - Vehicle management
- `/admin/bookings` - Booking management
- `/admin/users` - User management

## Booking Flow

1. **Booking Form** (`/booking`)
   - Fill customer details, vehicle selection, dates, locations
   - Real-time price calculation

2. **Summary** (`/summary`)
   - Review booking details
   - See total price with tax calculation

3. **Payment** (`/payment`)
   - Select payment method
   - Complete payment

4. **Confirmation** (`/booking-confirmation`)
   - Booking confirmed
   - View booking details

## Technology Stack

- **React 19** - UI framework
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Context API** - State management
- **LocalStorage** - Session persistence

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Authentication context
├── components/
│   └── ProtectedRoute.jsx    # Route protection
├── componts/
│   ├── home.jsx              # Home page
│   ├── booking.jsx           # Booking form
│   ├── vehiclerentalsummery.jsx  # Booking summary
│   ├── payment.jsx           # Payment page
│   ├── bookingConfirmation.jsx   # Confirmation page
│   ├── test1.jsx             # Auth page (login/register)
│   ├── layout.jsx             # Main layout with navbar/footer
│   ├── admin/
│   │   ├── Dashboard.jsx     # Admin dashboard
│   │   ├── Vehicles.jsx      # Vehicle management
│   │   ├── Bookings.jsx      # Booking management
│   │   └── Users.jsx         # User management
│   └── user/
│       └── Dashboard.jsx     # User dashboard
└── data/
    └── mockData.js           # Mock data storage
```

## Key Features

✅ Role-based authentication (Admin/User)
✅ Protected routes
✅ Premium UI design
✅ Responsive layout
✅ Booking management
✅ Vehicle management
✅ User management
✅ Payment integration (demo)
✅ Session persistence

## Notes

- Data is stored in memory (mockData.js) - will reset on page refresh
- In production, replace mockData functions with actual API calls
- Payment is simulated - integrate with payment gateway for production
