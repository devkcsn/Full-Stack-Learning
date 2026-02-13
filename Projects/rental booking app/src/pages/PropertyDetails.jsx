import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPropertyById, addBooking } from '../store/storage'
import BookingModal from '../components/BookingModal'
import { useAuth } from '../store/AuthProvider'

export default function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const foundProperty = getPropertyById(id)
    setProperty(foundProperty)
    setIsLoading(false)
  }, [id])

  const handleBooking = (bookingData) => {
    if (!user) {
      alert('Please login to complete your booking')
      navigate('/dashboard')
      return
    }

    const nights = calculateNights(bookingData.checkin, bookingData.checkout)
    const total = nights * property.price

    addBooking({
      ...bookingData,
      propertyId: property.id,
      user: user.email,
      total,
      propertyTitle: property.title,
      bookedAt: new Date().toISOString()
    })

    setShowBooking(false)
    
    // Success notification
    setTimeout(() => {
      alert('🎉 Booking confirmed! View your bookings in the dashboard.')
      navigate('/dashboard')
    }, 300)
  }

  const calculateNights = (checkin, checkout) => {
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)
    const diffTime = checkoutDate - checkinDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="card p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-secondary">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="card p-4 text-center">
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h4>Property Not Found</h4>
          <p className="empty-state-text">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary mt-3">
            Browse All Properties
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProperty = user && property.owner === user.email

  return (
    <div>
      {/* Back Navigation */}
      <div className="mb-3">
        <Link to="/" className="text-decoration-none text-secondary">
          ← Back to properties
        </Link>
      </div>

      <div className="card p-4">
        <div className="row g-4">
          {/* Property Image */}
          <div className="col-lg-7">
            <img 
              src={property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop'} 
              alt={property.title}
              className="img-fluid rounded"
              style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop'
              }}
            />
          </div>

          {/* Property Details */}
          <div className="col-lg-5">
            <div className="mb-3">
              <span className="badge bg-light text-dark mb-2">
                📍 {property.location}
              </span>
              <h2 className="mb-3">{property.title}</h2>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="text-secondary">
                  Hosted by <strong>{property.owner?.split('@')[0] || 'Anonymous'}</strong>
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="mb-2">About this place</h5>
              <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                {property.description}
              </p>
            </div>

            <div className="border-top pt-3 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary">Price per night</span>
                  <h3 className="mb-0 text-primary-custom">
                    {formatPrice(property.price)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              {isOwnProperty ? (
                <div className="alert alert-info mb-0">
                  <strong>This is your property</strong>
                  <p className="mb-0 small">You cannot book your own listing</p>
                </div>
              ) : (
                <>
                  <button 
                    className="btn btn-success btn-lg" 
                    onClick={() => setShowBooking(true)}
                  >
                    Book This Property
                  </button>
                  {!user && (
                    <small className="text-secondary text-center">
                      You'll need to sign in to complete booking
                    </small>
                  )}
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2">Important Information</h6>
              <ul className="small text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                <li>Check-in: After 2:00 PM</li>
                <li>Check-out: Before 11:00 AM</li>
                <li>Cancellation policy applies</li>
                <li>Valid ID required at check-in</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal 
          onClose={() => setShowBooking(false)} 
          onConfirm={handleBooking}
          property={property}
        />
      )}
    </div>
  )
}
