import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddProperty from './pages/AddProperty'
import PropertyDetails from './pages/PropertyDetails'
import Dashboard from './pages/Dashboard'
import AuthProvider from './store/AuthProvider'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddProperty />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
