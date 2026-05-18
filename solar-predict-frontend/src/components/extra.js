import React, { useState } from "react";
import "./Calculator.css";

export default function SolarCalculatorMain() {
  const [panelArea, setPanelArea] = useState(25);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [locationLabel, setLocationLabel] = useState("");

  // 📍 Browser Geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setLatitude(lat);
          setLongitude(lon);
          setLocationLabel(`Coordinates: ${lat}, ${lon}`);
          setError("");
        },
        () => {
          setError("Location access denied. Please enter City & Country.");
        }
      );
    } else {
      setError("Geolocation not supported on this browser.");
    }
  };

  // 🌍 Convert City+Country → Coordinates
  const getCoordsFromCity = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat).toFixed(4);
        const lon = parseFloat(data[0].lon).toFixed(4);
        setLatitude(lat);
        setLongitude(lon);
        setLocationLabel(`${city}, ${country}`);
        setError("");
      } else {
        setError("City not found. Try again.");
      }
    } catch {
      setError("Error fetching coordinates.");
    }
  };

  // 🔥 Call Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError("Please provide location (GPS or City/Country).");
      return;
    }
    try {
      const url = `http://127.0.0.1:8000/api/solar-prediction/?lat=${latitude}&lon=${longitude}&panel_area=${panelArea}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrediction(data);
    } catch {
      setError("Backend request failed.");
    }
  };

  return (
    <div className="solar-main-ui">
      <h2 className="solar-title">☀️ Solar Energy Calculator</h2>

      {/* Input Section */}
      <div className="solar-input-card">
        <div className="solar-card-header">Enter Location & Details</div>
        <form onSubmit={handleSubmit}>
          <div className="solar-inputs-row">
            {/* Auto Location */}
            <div className="solar-field wide">
              <button
                className="solar-calc-btn"
                type="button"
                onClick={getLocation}
              >
                 Use My Current Location
              </button>
            </div>

            <div className="solar-or-center">OR</div>

            {/* Manual City + Country */}
            <div className="solar-field">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
              />
            </div>
            <div className="solar-field">
              <label>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. USA"
              />
            </div>
            <div className="solar-field wide">
              <button
                className="solar-calc-btn secondary"
                type="button"
                onClick={getCoordsFromCity}
              >
                 Search City Coordinates
              </button>
            </div>
          </div>

          {/* Panel Area */}
          <div className="solar-field">
            <label>Panel Area (m²)</label>
            <input
              type="number"
              value={panelArea}
              onChange={(e) => setPanelArea(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="solar-field wide">
            <button className="solar-calc-btn primary" type="submit">
              ⚡ Calculate Predictions
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="error-msg">{error}</p>}
      </div>

      {/* Show Results */}
      {prediction && (
        <>
          {/* Current Solar Energy Section */}
          <div className="solar-energy-card">
            <div className="solar-energy-header">Current Solar Energy</div>
            {locationLabel && (
              <div className="solar-location-info">
                🌍Location: <strong>{locationLabel}</strong>
              </div>
            )}
            <div className="solar-energy-main">
              <span className="solar-energy-large">
                {prediction.solar_energy.toFixed(2)}
              </span>
              <span className="solar-energy-unit">kWh daily prediction</span>
            </div>

            <div className="solar-energy-details">
              <div>
                {prediction.solar_irradiance.toFixed(2)} kWh/m²/day{" "}
                <span className="solar-energy-detail-label">Irradiance</span>
              </div>
              <div>
                {prediction.weather.wind_speed} m/s{" "}
                <span className="solar-energy-detail-label">Wind Speed</span>
              </div>
              <div style={{ color: "#ec7150" }}>
                {(prediction.weather.temperature - 273.15).toFixed(1)}°C{" "}
                <span className="solar-energy-detail-label">Temperature</span>
              </div>
              <div style={{ color: "#2dcc6e" }}>
                AQI {prediction.aqi.AQI} ({prediction.aqi.Category}){" "}
                <span className="solar-energy-detail-label">Air Quality</span>
              </div>
              <div>
                {prediction.co2_offset.toFixed(2)} kg CO₂{" "}
                <span className="solar-energy-detail-label">Offset</span>
              </div>
            </div>
          </div>

          {/* Financial Savings */}
          <div className="solar-finance-card">
            <div className="solar-finance-header">Financial Savings</div>
            <div className="solar-finance-result-main">
              <span className="solar-finance-large">
                ${(prediction.solar_energy * 0.12 * 365).toFixed(0)}
              </span>
              <div className="solar-finance-desc">
                Estimated Annual Savings (at $0.12/kWh)
              </div>
            </div>
            <div className="solar-finance-bottom">
              With {panelArea} m² panels at{" "}
              {(prediction.efficiency * 100).toFixed(0)}% efficiency
            </div>
          </div>
        </>
      )}
    </div>
  );
}
