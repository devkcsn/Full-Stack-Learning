import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthProvider'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavClick}>
          <span className="brand-highlight">Rent</span>Easy
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={handleNavClick}
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/add') ? 'active' : ''}`} 
                to="/add"
                onClick={handleNavClick}
              >
                List Property
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                to="/dashboard"
                onClick={handleNavClick}
              >
                My Account
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary d-none d-md-inline">
                  {user.email.split('@')[0]}
                </span>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                className="btn btn-primary" 
                to="/dashboard"
                onClick={handleNavClick}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
