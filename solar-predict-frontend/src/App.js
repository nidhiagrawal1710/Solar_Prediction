import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Forecasting from "./components/Forecasting";
import Calculator from "./components/Calculator";
import Policies from "./components/Policies";

function App() {
  const [solarData, setSolarData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null); // ⬅ new
  const [forecastParams, setForecastParams] = useState(null);
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={<Calculator setSolarData={setSolarData} setLastUpdated={setLastUpdated} setForecastParams={setForecastParams} />}
           
        />

        <Route 
          path="/dashboard" 
          element={<Dashboard solarData={solarData} lastUpdated={lastUpdated} />} 
        />

        <Route 
          path="/forecasting" 
          element={<Forecasting locationData={forecastParams} />} 
        />

        <Route 
          path="/policies" 
          element={<Policies />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

