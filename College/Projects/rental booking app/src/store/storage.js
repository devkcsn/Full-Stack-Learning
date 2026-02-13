const STORAGE_KEYS = {
  properties: 'renteasy_properties',
  bookings: 'renteasy_bookings'
}

const SAMPLE_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Loft in City Center',
    description: 'Beautiful modern loft with high ceilings, large windows, and natural light. Walking distance to restaurants, shops, and entertainment. Perfect for business travelers or couples.',
    location: 'Mumbai, Maharashtra',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop',
    owner: 'rahul@example.com'
  },
  {
    id: '2',
    title: 'Cozy Studio Near Beach',
    description: 'Charming studio apartment just steps from the beach. Enjoy morning coffee on your private balcony with ocean views. Fully equipped kitchen and comfortable workspace.',
    location: 'Goa',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop',
    owner: 'priya@example.com'
  },
  {
    id: '3',
    title: 'Spacious 3BHK Family Home',
    description: 'Large family home with three bedrooms, modern kitchen, and spacious living areas. Private garden and parking. Great for families or groups. Quiet residential neighborhood.',
    location: 'Bangalore, Karnataka',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop',
    owner: 'amit@example.com'
  },
  {
    id: '4',
    title: 'Luxury Penthouse with Pool',
    description: 'Stunning penthouse suite with private rooftop pool and panoramic city views. Premium amenities, 24/7 concierge, gym access. Perfect for a luxurious getaway.',
    location: 'Delhi',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop',
    owner: 'sneha@example.com'
  },
  {
    id: '5',
    title: 'Charming Heritage Villa',
    description: 'Beautiful heritage property with traditional architecture and modern comforts. Surrounded by lush gardens, this villa offers a peaceful retreat while being close to the city.',
    location: 'Jaipur, Rajasthan',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop',
    owner: 'vikram@example.com'
  },
  {
    id: '6',
    title: 'Mountain View Cottage',
    description: 'Rustic cottage nestled in the hills with breathtaking mountain views. Cozy fireplace, wooden interiors, and a peaceful atmosphere. Ideal for nature lovers and weekend getaways.',
    location: 'Manali, Himachal Pradesh',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80&auto=format&fit=crop',
    owner: 'kavya@example.com'
  }
]

function read(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return []
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error)
  }
}

export function getProperties() {
  let properties = read(STORAGE_KEYS.properties)
  
  if (properties.length === 0) {
    properties = SAMPLE_PROPERTIES
    write(STORAGE_KEYS.properties, properties)
  }
  
  return properties
}

export function addProperty(property) {
  const properties = getProperties()
  const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newProperty = {
    ...property,
    id,
    createdAt: new Date().toISOString()
  }
  
  properties.unshift(newProperty)
  write(STORAGE_KEYS.properties, properties)
  
  return newProperty
}

export function getPropertyById(id) {
  return getProperties().find(property => property.id === id) || null
}

export function getPropertiesByOwner(email) {
  if (!email) return []
  return getProperties().filter(property => property.owner === email)
}

export function updateProperty(id, updates) {
  const properties = getProperties()
  const index = properties.findIndex(property => property.id === id)
  
  if (index !== -1) {
    properties[index] = {
      ...properties[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    write(STORAGE_KEYS.properties, properties)
    return properties[index]
  }
  
  return null
}

export function deleteProperty(id) {
  const properties = getProperties().filter(property => property.id !== id)
  write(STORAGE_KEYS.properties, properties)
}

export function getBookings() {
  return read(STORAGE_KEYS.bookings)
}

export function addBooking(booking) {
  const bookings = getBookings()
  const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newBooking = {
    ...booking,
    id,
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  }
  
  bookings.unshift(newBooking)
  write(STORAGE_KEYS.bookings, bookings)
  
  return newBooking
}

export function removeBooking(id) {
  const bookings = getBookings().filter(booking => booking.id !== id)
  write(STORAGE_KEYS.bookings, bookings)
}

export function getBookingsByUser(email) {
  if (!email) return []
  return getBookings().filter(booking => booking.user === email)
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.properties)
  localStorage.removeItem(STORAGE_KEYS.bookings)
}

export function resetToDefaults() {
  write(STORAGE_KEYS.properties, SAMPLE_PROPERTIES)
  write(STORAGE_KEYS.bookings, [])
}
