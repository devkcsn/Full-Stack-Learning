import React, { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import { getProperties } from '../store/storage'

export default function Home() {
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({ 
    location: '', 
    minPrice: '', 
    maxPrice: '', 
    searchQuery: '' 
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => {
      setProperties(getProperties())
      setIsLoading(false)
    }, 300)
  }, [])

  const filterProperties = () => {
    return properties.filter(property => {
      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Price range filter
      const minPrice = filters.minPrice ? Number(filters.minPrice) : 0
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity
      
      if (property.price < minPrice || property.price > maxPrice) {
        return false
      }

      // Search query filter (title and description)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const titleMatch = property.title.toLowerCase().includes(query)
        const descriptionMatch = property.description.toLowerCase().includes(query)
        
        if (!titleMatch && !descriptionMatch) {
          return false
        }
      }

      return true
    })
  }

  const filteredProperties = filterProperties()
  const hasActiveFilters = filters.location || filters.minPrice || filters.maxPrice || filters.searchQuery

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ location: '', minPrice: '', maxPrice: '', searchQuery: '' })
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="site-hero">
        <div className="hero-head">
          <div>
            <h1 className="hero-title">Discover Your Perfect Stay</h1>
            <p className="hero-sub">
              Find unique places to stay and unforgettable experiences around the world
            </p>
          </div>
          <div className="d-none d-md-block">
            <span className="hero-badge">
              🏠 {properties.length} Properties Available
            </span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-bar">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <input 
                className="form-control" 
                placeholder="Search properties..." 
                value={filters.searchQuery} 
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                aria-label="Search properties"
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <input 
                className="form-control" 
                placeholder="Location (e.g., Mumbai)" 
                value={filters.location} 
                onChange={(e) => handleFilterChange('location', e.target.value)}
                aria-label="Filter by location"
              />
            </div>
            <div className="col-lg-2 col-6">
              <input 
                className="form-control" 
                type="number" 
                placeholder="Min Price" 
                value={filters.minPrice} 
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                min="0"
                aria-label="Minimum price"
              />
            </div>
            <div className="col-lg-2 col-6">
              <input 
                className="form-control" 
                type="number" 
                placeholder="Max Price" 
                value={filters.maxPrice} 
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                min="0"
                aria-label="Maximum price"
              />
            </div>
            {hasActiveFilters && (
              <div className="col-lg-1 col-12">
                <button 
                  className="btn btn-outline-secondary w-100" 
                  onClick={clearFilters}
                  aria-label="Clear filters"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {hasActiveFilters ? `Found ${filteredProperties.length} result${filteredProperties.length !== 1 ? 's' : ''}` : 'All Properties'}
          </h5>
        </div>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="row">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                <div style={{ height: 220, background: '#e9ecef' }} className="placeholder-glow">
                  <span className="placeholder w-100 h-100"></span>
                </div>
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-8"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-12"></span>
                    <span className="placeholder col-9"></span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h4>No properties found</h4>
          <p className="empty-state-text">
            {hasActiveFilters 
              ? 'Try adjusting your search criteria or clear filters to see all properties' 
              : 'There are no properties available at the moment'}
          </p>
          {hasActiveFilters && (
            <button className="btn btn-primary mt-3" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredProperties.map(property => (
            <div key={property.id} className="col-lg-4 col-md-6 mb-4">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
