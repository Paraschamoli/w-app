import React from "react";
import { useEffect, useState } from "react";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "ad2168cbb7caa6c0511f120f1d149fab";

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by current location
  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          setLoading(true);
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          setWeather(data);
        } catch {
          setError("Failed to fetch location weather");
        } finally {
          setLoading(false);
        }
      });
    } else {
      setError("Geolocation not supported");
    }
  };

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">🌤️ Weather App</h1>

      {/* Search Box */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        />
        <button
          onClick={() => fetchWeatherByCity(city)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300"
        >
          Search
        </button>
      </div>

      {/* Current Location Button */}
      <button
        onClick={fetchWeatherByLocation}
        className="mb-6 bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-300"
      >
        📍 Use Current Location
      </button>

      {/* Loading / Error */}
      {loading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-red-200">{error}</p>}

      {/* Weather Info */}
      {weather && !loading && (
        <div className="bg-white/20 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">{weather.name}</h2>
          <img
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            className="mx-auto"
          />
          <p className="text-4xl font-bold">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬️ Wind: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}
