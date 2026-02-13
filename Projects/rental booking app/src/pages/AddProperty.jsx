import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthProvider'
import { addProperty } from '../store/storage'

export default function AddProperty() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    image: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!form.title.trim()) {
      newErrors.title = 'Property title is required'
    } else if (form.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (form.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!form.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      addProperty({
        ...form,
        price: Number(form.price),
        owner: user.email
      })
      
      // Show success and navigate
      setTimeout(() => {
        navigate('/', { state: { message: 'Property listed successfully!' } })
      }, 500)
    } catch (error) {
      alert('Failed to add property. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!user) {
    return (
      <div className="alert alert-warning">
        <h5 className="alert-heading">Authentication Required</h5>
        <p className="mb-0">
          You must be logged in to list a property. Please{' '}
          <a href="/dashboard" className="alert-link">sign in</a> to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="mb-4">
        <h3 className="mb-2">List Your Property</h3>
        <p className="text-secondary mb-0">
          Share your space with travelers and start earning
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Property Title *</label>
          <input 
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="e.g., Cozy 2BHK Apartment in Downtown"
            value={form.title} 
            onChange={(e) => handleInputChange('title', e.target.value)}
            required 
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea 
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows="4"
            placeholder="Describe your property, amenities, nearby attractions..."
            value={form.description} 
            onChange={(e) => handleInputChange('description', e.target.value)}
            required 
          />
          <small className="text-secondary">
            {form.description.length}/500 characters
          </small>
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label">Location *</label>
            <input 
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
              placeholder="e.g., Mumbai, Maharashtra"
              value={form.location} 
              onChange={(e) => handleInputChange('location', e.target.value)}
              required 
            />
            {errors.location && (
              <div className="invalid-feedback">{errors.location}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Price per Night (₹) *</label>
            <input 
              type="number" 
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              placeholder="e.g., 2500"
              value={form.price} 
              onChange={(e) => handleInputChange('price', e.target.value)}
              min="1"
              required 
            />
            {errors.price && (
              <div className="invalid-feedback">{errors.price}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Property Image URL (Optional)</label>
          <input 
            className="form-control" 
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.image} 
            onChange={(e) => handleInputChange('image', e.target.value)}
          />
          <small className="text-secondary">
            Add a URL to an image of your property. Leave blank to use a default image.
          </small>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner me-2"></span>
                Adding...
              </>
            ) : (
              'List Property'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
