import React, { useState } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  console.log("API KEY:", API_KEY); // Verificación en consola

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;
      console.log("URL generada:", url); // Verificación en consola

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setError('');
      } else {
        setWeather(null);
        setError(data.message || 'Ciudad no encontrada');
      }
    } catch (err) {
      setError('Error al obtener los datos');
    }
  };

  // Fondo dinámico según el ícono del clima
  const getBackgroundStyle = () => {
    if (!weather) return { backgroundColor: '#f0f0f0' };

    const icon = weather.weather[0].icon;

    if (icon.includes('01')) return { backgroundColor: '#ffe680' }; // cielo claro
    if (icon.includes('02') || icon.includes('03')) return { backgroundColor: '#d0d0d0' }; // nubes
    if (icon.includes('09') || icon.includes('10')) return { backgroundColor: '#a0c4ff' }; // lluvia
    if (icon.includes('11')) return { backgroundColor: '#9999ff' }; // tormenta
    if (icon.includes('13')) return { backgroundColor: '#e0f7fa' }; // nieve
    if (icon.includes('50')) return { backgroundColor: '#cccccc' }; // niebla

    return { backgroundColor: '#f0f0f0' }; // por defecto
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', minHeight: '100vh', ...getBackgroundStyle() }}>
      <h1>🌤️ Consulta el Clima</h1>
      <p>Ejemplo: "Madrid, ES" o "Tokyo, JP"</p>
      <input
        type="text"
        placeholder="Escribí una ciudad..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            fetchWeather();
          }
        }}
        style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
      />
      <br />
      <button onClick={fetchWeather} style={{ padding: '10px 20px' }}>
        Buscar
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            style={{ width: '100px', height: '100px' }}
          />
          <p>🌡️ Temperatura: {weather.main.temp}°C</p>
          <p>🌥️ Condición: {weather.weather[0].description}</p>
          <p>💧 Humedad: {weather.main.humidity}%</p>
          <p>🌬️ Viento: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;


