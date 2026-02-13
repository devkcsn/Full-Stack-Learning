import React, { useState, useEffect } from 'react'

export default function BookingModal({ onClose, onConfirm, property }) {
  const [form, setForm] = useState({ checkin: '', checkout: '', guests: 1 })
  const [errors, setErrors] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (form.checkin && form.checkout) {
      const nights = calculateNights()
      if (nights > 0 && property) {
        setTotalPrice(nights * property.price)
      }
    }
  }, [form.checkin, form.checkout, property])

  const calculateNights = () => {
    if (!form.checkin || !form.checkout) return 0
    const checkinDate = new Date(form.checkin)
    const checkoutDate = new Date(form.checkout)
    const diffTime = checkoutDate - checkinDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.checkin) {
      newErrors.checkin = 'Check-in date is required'
    }
    
    if (!form.checkout) {
      newErrors.checkout = 'Check-out date is required'
    }
    
    if (form.checkin && form.checkout) {
      const checkinDate = new Date(form.checkin)
      const checkoutDate = new Date(form.checkout)
      
      if (checkoutDate <= checkinDate) {
        newErrors.checkout = 'Check-out must be after check-in'
      }
    }
    
    if (form.guests < 1) {
      newErrors.guests = 'At least 1 guest is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onConfirm(form)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="booking-modal">
        <div className="modal-header">
          <h5 className="modal-title">Complete Your Booking</h5>
          <button 
            className="btn-close-modal" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Check-in Date</label>
            <input 
              type="date" 
              className={`form-control ${errors.checkin ? 'is-invalid' : ''}`}
              value={form.checkin} 
              min={today}
              onChange={(e) => setForm({ ...form, checkin: e.target.value })} 
              required 
            />
            {errors.checkin && (
              <div className="invalid-feedback d-block">{errors.checkin}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Check-out Date</label>
            <input 
              type="date" 
              className={`form-control ${errors.checkout ? 'is-invalid' : ''}`}
              value={form.checkout} 
              min={form.checkin || today}
              onChange={(e) => setForm({ ...form, checkout: e.target.value })} 
              required 
            />
            {errors.checkout && (
              <div className="invalid-feedback d-block">{errors.checkout}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Number of Guests</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              className={`form-control ${errors.guests ? 'is-invalid' : ''}`}
              value={form.guests} 
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} 
              required
            />
            {errors.guests && (
              <div className="invalid-feedback d-block">{errors.guests}</div>
            )}
          </div>

          {form.checkin && form.checkout && calculateNights() > 0 && (
            <div className="alert alert-info mb-3">
              <div className="d-flex justify-content-between">
                <span>{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
