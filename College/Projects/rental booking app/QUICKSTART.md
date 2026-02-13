# Quick Start Guide

## Installation & Running

### Step 1: Install Dependencies
Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router 6
- Bootstrap 5
- Vite
- @vitejs/plugin-react

### Step 2: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 3: Explore the Application

#### As a Guest:
1. **Browse Properties** - The home page shows all available listings
2. **Search & Filter** - Use the search bar to filter by location, price, or keywords
3. **View Details** - Click any property card to see full details
4. **Book a Stay** - Click "Book This Property" and select your dates
5. **Sign In** - Use any email (e.g., guest@example.com) to create a booking
6. **View Bookings** - Check "My Account" to see all your bookings

#### As a Host:
1. **Sign In** - Go to "My Account" and enter any email (e.g., host@example.com)
2. **List Property** - Click "List Property" in navigation
3. **Fill Details** - Add title, description, location, price, and optional image URL
4. **Submit** - Your property is now live!
5. **Manage Listings** - View your properties in the "My Properties" tab

## Sample Data

The app comes with 6 pre-loaded properties:
- Modern Loft in Mumbai (₹3,500/night)
- Cozy Studio in Goa (₹2,800/night)
- Spacious 3BHK in Bangalore (₹4,500/night)
- Luxury Penthouse in Delhi (₹8,000/night)
- Heritage Villa in Jaipur (₹5,200/night)
- Mountain View Cottage in Manali (₹3,200/night)

## Testing Tips

### Test User Flows:
1. **Search Flow**: Filter properties by location "Mumbai" or price range
2. **Booking Flow**: Book a property from Oct 15-20, 2025
3. **Host Flow**: Sign in and list a new property
4. **Dashboard Flow**: View your bookings and properties

### Test Responsive Design:
- Resize browser window to see mobile/tablet views
- Check mobile menu (hamburger icon)
- Test all forms on mobile

### Test Validations:
- Try submitting empty forms
- Enter invalid check-out dates (before check-in)
- Try booking with 0 guests

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: The dev server will automatically use port 3001 or change the port in `vite.config.js`

### Issue: Images not loading
**Solution**: Images use external URLs. If they don't load, the app will show fallback images

### Issue: Data disappears on refresh
**Solution**: Data is stored in browser localStorage. Clear cache will reset data

### Issue: npm install fails
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` folder.

Preview the production build locally:

```bash
npm run preview
```

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant updates when you save files. No need to refresh!

### Browser DevTools
- Use React Developer Tools extension
- Check Console for any errors
- Use Network tab to see data flow

### LocalStorage Data
View stored data in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. See `renteasy_properties` and `renteasy_bookings`

### Reset Data
To clear all data and start fresh:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page

## Need Help?

- Check `IMPROVEMENTS.md` for detailed changes
- Review `README.md` for full documentation
- Inspect component code for inline understanding
- Check browser console for error messages

---

Enjoy exploring the app! 🚀
