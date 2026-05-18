import React, { useState, useEffect } from "react";
import "./Forcasting.css";

function SolarForecast({ locationData }) {
  const [forecastData, setForecastData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (locationData) {
      fetchForecast();
    }
  }, [locationData]);

  const fetchForecast = async () => {
    const { latitude, longitude, panelArea } = locationData;

    setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/forecasting-prediction/?lat=${latitude}&lon=${longitude}&panel_area=${panelArea}`;

      const res = await fetch(url);
      const data = await res.json();

      setForecastData(data.daily_forecast);
      setSummary(data.summary);
      setError("");
    } catch (err) {
      setError("Failed to fetch forecast data.");
    } finally {
      setLoading(false);
    }
  };

  const getConditionIcon = (irradiance) => {
    if (irradiance > 4.2) return "☀️";
    if (irradiance > 3) return "🌤️";
    if (irradiance > 2) return "☁️";
    return "🌧️";
  };

  if (!locationData)
    return <div className="solar-forecast">Please calculate first.</div>;

  if (loading) return <div className="solar-forecast">Loading forecast...</div>;
  if (error) return <div className="solar-forecast">{error}</div>;

  return (
    <div className="solar-forecast">
      <div className="forecast-header">
        <h2>Solar Forecast</h2>
        <p>7-day energy generation prediction</p>
      </div>

      <div className="forecast-grid">
        {forecastData.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="day">{day.day}</div>
            <div className="condition">
              {getConditionIcon(day.solar_irradiance)}
            </div>
            <div className="output">{day.solar_energy} kWh</div>
          </div>
        ))}
      </div>

      {summary && (
        <div className="forecast-summary">
          <div className="summary-item">
            <span>Avg. Daily Output:</span>
            <strong>{summary.avg_daily_output} kWh</strong>
          </div>
          <div className="summary-item">
            <span>Total Weekly:</span>
            <strong>{summary.total_weekly_output} kWh</strong>
          </div>
          <div className="summary-item">
            <span>Peak Day:</span>
            <strong>
              {summary.peak_day} ({summary.peak_day_energy} kWh)
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolarForecast;
// import React, { useState, useEffect } from "react";
// import "./Forcasting.css";

// function SolarForecast() {
//   const [forecastData, setForecastData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // You can later pass these as props like Calculator
//   const latitude = 21.3087;
//   const longitude = 76.2303;
//   const panelArea = 25;

//   useEffect(() => {
//     fetchForecast();
//   }, []);

//   const fetchForecast = async () => {
//     setLoading(true);
//     try {
//       const url = `http://127.0.0.1:8000/api/forecasting-prediction/?lat=${latitude}&lon=${longitude}&panel_area=${panelArea}`;

//       const res = await fetch(url);
//       const data = await res.json();

//       setForecastData(data.daily_forecast);
//       setSummary(data.summary);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch forecast data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🌤 Icon Based on Irradiance
//   const getConditionIcon = (irradiance) => {
//     if (irradiance > 4.4) return "☀️";
//     if (irradiance > 4) return "🌤️";
//     if (irradiance > 2) return "☁️";
//     return "🌧️";
//   };

//   if (loading) return <div className="solar-forecast">Loading forecast...</div>;
//   if (error) return <div className="solar-forecast">{error}</div>;

//   return (
//     <div className="solar-forecast">
//       <div className="forecast-header">
//         <h2>Solar Forecast</h2>
//         <p>7-day energy generation prediction</p>
//       </div>

//       <div className="forecast-grid">
//         {forecastData.map((day, index) => (
//           <div key={index} className="forecast-card">
//             <div className="day">{day.day}</div>
//             <div className="condition">
//               {getConditionIcon(day.solar_irradiance)}
//             </div>
//             <div className="output">{day.solar_energy} kWh</div>
//           </div>
//         ))}
//       </div>

//       {summary && (
//         <div className="forecast-summary">
//           <div className="summary-item">
//             <span>Avg. Daily Output:</span>
//             <strong>{summary.avg_daily_output} kWh</strong>
//           </div>
//           <div className="summary-item">
//             <span>Total Weekly:</span>
//             <strong>{summary.total_weekly_output} kWh</strong>
//           </div>
//           <div className="summary-item">
//             <span>Peak Day:</span>
//             <strong>
//               {summary.peak_day} ({summary.peak_day_energy} kWh)
//             </strong>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SolarForecast;