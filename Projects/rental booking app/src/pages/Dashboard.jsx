import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/AuthProvider'
import { getBookings, getProperties, removeBooking, getPropertiesByOwner } from '../store/storage'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, login } = useAuth()
  const [bookings, setBookings] = useState([])
  const [myProperties, setMyProperties] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      setTimeout(() => {
        setBookings(getBookings())
        setMyProperties(getPropertiesByOwner(user.email))
        setIsLoading(false)
      }, 300)
    }
  }, [user])

  const handleLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }
    
    login({ email })
  }

  const handleCancelBooking = (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    )
    
    if (confirmed) {
      removeBooking(bookingId)
      setBookings(getBookings())
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Login View
  if (!user) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h3 className="mb-2">Welcome Back</h3>
              <p className="text-secondary mb-0">
                Sign in to manage your bookings and properties
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input 
                  name="email" 
                  type="email"
                  className="form-control form-control-lg" 
                  placeholder="your.email@example.com" 
                  required 
                  autoFocus
                />
                <small className="text-secondary">
                  For demo purposes, enter any email to access your account
                </small>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 btn-lg">
                Sign In
              </button>
            </form>

            <div className="mt-4 p-3 bg-light rounded text-center">
              <small className="text-secondary">
                <strong>Demo Mode:</strong> This is a learning project. 
                No real authentication is required.
              </small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const userBookings = bookings.filter(b => b.user === user.email)
  const allProperties = getProperties()

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-2">My Dashboard</h2>
        <p className="text-secondary mb-0">
          Welcome back, <strong>{user.email.split('@')[0]}</strong>! 
          Manage your bookings and listings here.
        </p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({userBookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            My Properties ({myProperties.length})
          </button>
        </li>
      </ul>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : userBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h5>No Bookings Yet</h5>
              <p className="empty-state-text">
                Start exploring amazing properties and book your first stay!
              </p>
              <Link to="/" className="btn btn-primary mt-3">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="row">
              {userBookings.map(booking => {
                const property = allProperties.find(p => p.id === booking.propertyId)
                
                return (
                  <div key={booking.id} className="col-12 mb-3">
                    <div className="booking-item">
                      <div className="booking-info flex-grow-1">
                        <h6 className="mb-2">
                          <Link 
                            to={`/property/${booking.propertyId}`}
                            className="text-decoration-none"
                          >
                            {property?.title || 'Property not found'}
                          </Link>
                        </h6>
                        <div className="booking-details">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <small className="d-block">
                                <strong>Check-in:</strong> {formatDate(booking.checkin)}
                              </small>
                            </div>
                            <div className="col-md-4">
                              <small className="d-block">
                                <strong>Check-out:</strong> {formatDate(booking.checkout)}
                              </small>
                            </div>
                            <div className="col-md-4">
                              <small className="d-block">
                                <strong>Guests:</strong> {booking.guests}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="booking-total">
                          Total: {formatPrice(booking.total)}
                        </div>
                      </div>
                      <div>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : myProperties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏠</div>
              <h5>No Properties Listed</h5>
              <p className="empty-state-text">
                Share your space with travelers and start earning today!
              </p>
              <Link to="/add" className="btn btn-primary mt-3">
                List Your Property
              </Link>
            </div>
          ) : (
            <div className="row">
              {myProperties.map(property => (
                <div key={property.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="row g-0">
                      <div className="col-4">
                        <img 
                          src={property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80&auto=format&fit=crop'}
                          alt={property.title}
                          style={{ 
                            height: '100%', 
                            width: '100%', 
                            objectFit: 'cover',
                            minHeight: '150px'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80&auto=format&fit=crop'
                          }}
                        />
                      </div>
                      <div className="col-8">
                        <div className="card-body">
                          <h6 className="card-title mb-1">{property.title}</h6>
                          <p className="text-secondary small mb-2">
                            📍 {property.location}
                          </p>
                          <p className="mb-2">
                            <strong className="text-primary-custom">
                              {formatPrice(property.price)}
                            </strong>
                            <span className="text-secondary small"> /night</span>
                          </p>
                          <Link 
                            to={`/property/${property.id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
