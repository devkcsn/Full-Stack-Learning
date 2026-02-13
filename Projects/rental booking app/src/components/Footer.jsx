import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">
                <span style={{ color: '#e74c3c' }}>Rent</span>Easy
              </span>
              <span className="text-secondary">•</span>
              <span className="small text-secondary">
                © {currentYear} All rights reserved
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end gap-3 flex-wrap">
              <Link to="/" className="text-decoration-none">Home</Link>
              <a href="#" className="text-decoration-none" onClick={(e) => e.preventDefault()}>
                About Us
              </a>
              <a href="#" className="text-decoration-none" onClick={(e) => e.preventDefault()}>
                Support
              </a>
              <a href="#" className="text-decoration-none" onClick={(e) => e.preventDefault()}>
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
