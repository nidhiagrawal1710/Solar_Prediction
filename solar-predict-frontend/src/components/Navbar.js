import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { FiSun, FiSettings, FiChevronDown, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  const navigation = [
    { path: "/", label: "Dashboard" },
    { path: "/forecasting", label: "Forecasting" },
    { path: "/calculator", label: "Calculator" },
    { path: "/policies", label: "Policies" },
  ];

  const cities = ["Mumbai", "Pune", "Delhi", "Bangalore", "Chennai"];

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <FiSun className="logo-icon" />
            <span>SolarPredict</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
                <span className="nav-indicator"></span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="nav-controls">
            

            {/* Settings */}
            <button className="settings-btn">
              <FiSettings />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-links">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mobile-city-selector">
            <select 
              className="mobile-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;