import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="card h-100">
      <div style={{ position: 'relative' }}>
        <img 
          src={property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop'} 
          className="card-img-top" 
          alt={property.title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80&auto=format&fit=crop'
          }}
        />
        <span className="property-badge">
          📍 {property.location}
        </span>
        <span className="property-price-badge">
          {formatPrice(property.price)}/night
        </span>
      </div>
      <div className="card-body">
        <h5 className="card-title">{property.title}</h5>
        <p className="card-text text-secondary mb-3">
          {truncateText(property.description, 100)}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Link to={`/property/${property.id}`} className="btn btn-outline-primary btn-sm">
            View Details
          </Link>
          <small className="text-secondary">
            <span className="d-none d-sm-inline">Host: </span>
            {property.owner?.split('@')[0] || 'Anonymous'}
          </small>
        </div>
      </div>
    </div>
  )
}
