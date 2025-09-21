import React, { useState } from 'react';
import { Search, MapPin, Thermometer, Droplets, Eye, Wind, Loader2 } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Por favor ingresa el nombre de una ciudad');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error('Ciudad no encontrada');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Error al obtener los datos del clima');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('lluvia') || desc.includes('rain')) return '🌧️';
    if (desc.includes('nube') || desc.includes('cloud')) return '☁️';
    if (desc.includes('sol') || desc.includes('clear')) return '☀️';
    if (desc.includes('nieve') || desc.includes('snow')) return '❄️';
    if (desc.includes('tormenta') || desc.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const popularCities = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    'Madrid', 'Barcelona', 'Buenos Aires', 'México', 'Lima',
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney'
  ];

  const selectCity = (selectedCity) => {
    setCity(selectedCity);
    // Simular que el usuario escribió la ciudad y hacer la búsqueda automáticamente
    setLoading(true);
    setError('');
    
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/weather?city=${encodeURIComponent(selectedCity)}`);
        
        if (!response.ok) {
          throw new Error('Ciudad no encontrada');
        }
        
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los datos del clima');
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }, 300); // Pequeño delay para mostrar el efecto de carga
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="flex gap-6 max-w-6xl w-full mx-auto justify-center">
        
        {/* Panel principal */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md flex-shrink-0">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            -- SkyCast --
          </h1>
          <p className="text-green-600">Consulta el clima de tu ciudad</p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa el nombre de la ciudad..."
              className="w-full px-4 py-3 pr-12 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            />
            <Search 
              className="absolute right-3 top-3 text-green-400 cursor-pointer hover:text-green-600 transition-colors"
              size={24}
              onClick={searchWeather}
            />
          </div>
          
          <button
            onClick={searchWeather}
            disabled={loading}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Buscando...
              </>
            ) : (
              'Buscar Clima'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Weather Data */}
        {weatherData && (
          <div className="space-y-6">
            
            {/* City and Icon */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="text-green-600" size={20} />
                <h2 className="text-2xl font-bold text-green-800">{weatherData.name}</h2>
              </div>
              <div className="text-6xl mb-2">
                {getWeatherIcon(weatherData.weather[0].description)}
              </div>
              <p className="text-green-600 capitalize text-lg">
                {weatherData.weather[0].description}
              </p>
            </div>

            {/* Temperature Card */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Thermometer className="text-green-600" size={24} />
                <span className="text-green-700 font-medium">Temperatura</span>
              </div>
              <div className="text-4xl font-bold text-green-800">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-green-600 mt-1">
                Sensación térmica: {Math.round(weatherData.main.temp)}°C
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Humidity */}
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Droplets className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-green-700 font-medium">Humedad</p>
                  <p className="text-green-800 font-bold">{weatherData.main.humidity}%</p>
                </div>
              </div>

              {/* Weather Status */}
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Eye className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-green-700 font-medium">Condiciones</p>
                  <p className="text-green-800 font-bold capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-green-200">
              <p className="text-green-500 text-sm">
                Datos actualizados • OpenWeatherMap
              </p>
            </div>

          </div>
        )}

        {/* Welcome Message */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              ¡Bienvenido a SkyCast!
            </h3>
            <p className="text-green-600">
              Ingresa el nombre de una ciudad para consultar su clima actual
            </p>
          </div>
        )}

        </div>

        {/* Panel de ciudades populares */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-80 flex-shrink-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
              🌍 Ciudades Populares
            </h3>
            <p className="text-green-600 text-sm">
              Haz click en cualquier ciudad para ver su clima
            </p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {popularCities.map((cityName, index) => (
              <button
                key={index}
                onClick={() => selectCity(cityName)}
                disabled={loading}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                  city === cityName 
                    ? 'bg-green-100 border-2 border-green-400 text-green-800' 
                    : 'bg-green-50 hover:bg-green-100 border-2 border-transparent hover:border-green-200 text-green-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                <div className="text-lg">
                  {cityName === 'Bogotá' && '🇨🇴'}
                  {cityName === 'Medellín' && '🇨🇴'}
                  {cityName === 'Cali' && '🇨🇴'}
                  {cityName === 'Barranquilla' && '🇨🇴'}
                  {cityName === 'Cartagena' && '🇨🇴'}
                  {cityName === 'Madrid' && '🇪🇸'}
                  {cityName === 'Barcelona' && '🇪🇸'}
                  {cityName === 'Buenos Aires' && '🇦🇷'}
                  {cityName === 'México' && '🇲🇽'}
                  {cityName === 'Lima' && '🇵🇪'}
                  {cityName === 'New York' && '🇺🇸'}
                  {cityName === 'London' && '🇬🇧'}
                  {cityName === 'Paris' && '🇫🇷'}
                  {cityName === 'Tokyo' && '🇯🇵'}
                  {cityName === 'Sydney' && '🇦🇺'}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{cityName}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Search size={16} className="text-green-500" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-green-200">
            <p className="text-green-500 text-xs text-center">
              💡 Tip: También puedes escribir cualquier ciudad en el buscador
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherApp;