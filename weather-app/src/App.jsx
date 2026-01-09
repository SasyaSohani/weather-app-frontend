
import "./App.css";

import { useState } from "react";
    
function App() {

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);


  const handleSearch = async () => {
  if (!city) return;

  setLoading(true);
  setError("");
  setWeatherData(null);
  setForecast([]);

  try {
    const response = await fetch(
      `http://weather-app-backend-1-zl8p.onrender.com/api/weather?city=${city}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    setWeatherData(data);
    const forecastRes = await fetch(
      `http://weather-app-backend-1-zl8p.onrender.com/api/forecast?city=${city}`
    );
    const forecastData = await forecastRes.json();

    setForecast(forecastData);    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const getBgColor = () => {
  if (!weatherData) return "#f5f7fa";

  const condition = weatherData.condition.toLowerCase();

  if (condition.includes("rain")) return "#dbeafe";
  if (condition.includes("clear")) return "#fef9c3";
  if (condition.includes("cloud")) return "#e5e7eb";

  return "#f5f7fa";
};

  return (
    
    <div className = "app-container" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 className = "app-title">Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className = "status" style={{ marginTop: "20px" }}>
        {loading && <p className="status loading">Fetching weather...</p>}
        {error && <p  className="status error" style={{ color: "red" }}>{error}</p>}
      </div>

      {weatherData && (
        <div className="weather-card" 
        style={{
            marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background: getBgColor(),
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
         }}>
          <h2 style = {{color:"black", fontSize: "28px", marginBottom: "5px"}}>
            {weatherData.city}
          </h2>
              <img
                 src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                 alt="weather icon"
                   style={{
                    filter:
                    "drop-shadow(1px 1px 0 black), drop-shadow(-1px 1px 0 black), drop-shadow(1px -1px 0 black), drop-shadow(-1px -1px 0 black)",
                     width: "80px",
                     height: "80px",
                     margin: "10px auto",
                     display: "block",
                   }}
              />

    <p className="temp" style={{color:"black" ,fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>
      {weatherData.temperature}°C
    </p>

    <p className="condition" style={{color:"black", textTransform: "capitalize", color: "#555", fontWeight: "bold" }}>
      {weatherData.condition}
    </p>

    <p style={{ color:"#555" , fontWeight: "bold"}}>
      Humidity: {weatherData.humidity} %
    </p>

    <p style={{color:"#555", fontWeight: "bold" }}>
      Wind Speed: {weatherData.windSpeed} m/s
    </p>
        </div>
      )}
      {forecast.length > 0 && (
  <div className="forecast-container">
    <h3 className="forecast-title">5-Day Forecast</h3>

    <div className="forecast-grid">
      {forecast.map((day, index) => (
        <div className="forecast-card" key={index}>
          <p className="forecast-date">{day.date}</p>

          <img
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt="forecast icon"
          />

          <p className="forecast-temp">{day.temp}°C</p>
          <p className="forecast-condition">{day.condition}</p>
        </div>
      ))}
    </div>
   </div>
  )}
    </div>
  );

}

export default App;
