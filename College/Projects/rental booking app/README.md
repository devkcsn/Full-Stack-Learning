# RentEasy - Property Rental & Booking Platform

A modern, responsive property rental and booking application built with React, featuring an intuitive interface for browsing properties, making bookings, and managing listings.

## ✨ Features

### For Guests
- Browse properties with advanced search and filtering
- View detailed property information with high-quality images
- Book properties with date selection and guest count
- Manage all bookings in a personal dashboard

### For Hosts
- List new properties with comprehensive details
- Manage all property listings
- Track booking activity

### Technical Features
- Fully responsive design (mobile, tablet, desktop)
- Modern UI with smooth animations and transitions
- LocalStorage for data persistence
- Demo authentication system
- Form validation and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser at `http://localhost:3000`

## 📁 Project Structure

```
rental-booking-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PropertyCard.jsx
│   │   └── BookingModal.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── PropertyDetails.jsx
│   │   ├── AddProperty.jsx
│   │   └── Dashboard.jsx
│   ├── store/           # State management & storage
│   │   ├── AuthProvider.jsx
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Technologies Used

- React 18 - UI library
- React Router 6 - Client-side routing
- Bootstrap 5 - Responsive UI framework
- Vite - Build tool and dev server
- LocalStorage API - Data persistence

## 💡 Usage Guide

### Browsing Properties
1. Visit the home page to see all properties
2. Use filters to search by location, price, or keywords
3. Click on a property card to view full details

### Making a Booking
1. On a property details page, click "Book This Property"
2. Select check-in and check-out dates
3. Enter number of guests
4. Confirm your booking (login required)

### Listing a Property
1. Sign in via "My Account"
2. Navigate to "List Property"
3. Fill in all required details
4. Submit to publish your listing

## 🎨 Customization

### Changing Theme Colors
Edit CSS variables in `src/styles.css`:

```css
:root {
  --primary-color: #e74c3c;
  --primary-hover: #c0392b;
  --secondary-color: #34495e;
}
```

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 320px - 767px

## 🚢 Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🎯 Future Enhancements

Potential features to add:
- Firebase authentication & Firestore
- Property ratings and reviews
- Google Maps integration
- Image upload functionality
- Dark mode toggle
- Email notifications
- Payment integration
- Availability calendar

## 📄 License

Educational project for learning purposes.

---

**Note**: This is a demo application using simplified authentication and localStorage. For production, implement proper backend services, authentication, and database integration.