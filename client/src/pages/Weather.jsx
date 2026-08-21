import { useState } from "react";
import api from "../api";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await api.get(
  `/api/weather/${city}`
);

      setWeather(response.data);
    } catch (err) {
      console.error("Weather error:", err);

      if (err.response?.status === 404) {
        setError("City not found. Please check the city name.");
      } else if (err.response?.status === 401) {
        setError("Invalid weather API key.");
      } else {
        setError("Unable to get weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#eef8e8",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#237a2c", marginBottom: "10px" }}>
        🌦️ Weather Information
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Check current weather conditions for your location.
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getWeather();
            }
          }}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={getWeather}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Checking Weather..." : "Get Weather"}
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}

        {weather && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f5fff2",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ color: "#237a2c" }}>
              📍 {weather.name}, {weather.sys.country}
            </h2>

            <div style={{ fontSize: "50px" }}>
              🌡️
            </div>

            <h1 style={{ margin: "5px 0", color: "#333" }}>
              {Math.round(weather.main.temp)}°C
            </h1>

            <h3 style={{ textTransform: "capitalize", color: "#555" }}>
              {weather.weather[0].description}
            </h3>

            <p>
              🌡️ Feels like:{" "}
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </p>

            <p>
              💧 Humidity: <strong>{weather.main.humidity}%</strong>
            </p>

            <p>
              💨 Wind: <strong>{weather.wind.speed} m/s</strong>
            </p>

            <p>
              🔽 Pressure: <strong>{weather.main.pressure} hPa</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
