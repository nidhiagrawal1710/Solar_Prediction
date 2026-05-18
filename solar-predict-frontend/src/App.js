// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";
// import Forecasting from "./components/Forecasting";
// import Calculator from "./components/Calculator";
// import Policies from "./components/Policies";
// // import Login from "./components/auth/Login";

// function App() {
//   const [solarData, setSolarData] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   // const handleLogout = () => {
//   //   setToken(null);
//   //   localStorage.removeItem("token");
//   // };

//   if (!token) {
//     return <Login setToken={(t) => { setToken(t); localStorage.setItem("token", t); }} />;
//   }

//   return (
//     <Router>
//       {/* <Navbar onLogout={handleLogout} /> */}
//       <Routes>
//         <Route 
//           path="/" 
//           element={<Dashboard solarData={solarData} lastUpdated={lastUpdated} token={token} />} 
//         />

//         <Route 
//           path="/calculator" 
//           element={<Calculator setSolarData={setSolarData} setLastUpdated={setLastUpdated} token={token} />} 
//         />

//         <Route 
//           path="/forecasting" 
//           element={<Forecasting solarData={solarData} token={token} />} 
//         />

//         <Route 
//           path="/policies" 
//           element={<Policies token={token} />} 
//         />

//         {/* Redirect unknown routes to home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
          element={<Dashboard solarData={solarData} lastUpdated={lastUpdated} />} 
        />

        <Route 
          path="/calculator" 
          element={<Calculator setSolarData={setSolarData} setLastUpdated={setLastUpdated} setForecastParams={setForecastParams} />} 
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

