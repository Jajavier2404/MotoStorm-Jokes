import React, { useState, useEffect } from 'react';

function Jokes() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  const getJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/joke");
      // Simular un poco de retraso para la animación de carga
      await new Promise(res => setTimeout(res, 500));
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      setJoke("No se pudo cargar un chiste. ¿Está el servidor Go en ejecución?");
      console.error("Error al obtener chiste:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJoke();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-blue-900 flex flex-col justify-center items-center p-4 font-sans">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center transform transition-all duration-500 hover:scale-105">
        <h1 className="text-5xl font-bold text-white mb-4">
          <span role="img" aria-label="gafas de sol">😎</span> Chuck Norris Dice:
        </h1>
        
        <div id="joke-container" className="text-2xl text-blue-100 my-8 p-6 bg-black/20 rounded-xl min-h-[150px] flex items-center justify-center transition-opacity duration-300">
          {loading ? (
            <div className="animate-pulse">Cargando chiste...</div>
          ) : (
            <p className="transition-all duration-300">{joke}</p>
          )}
        </div>

        <button 
          onClick={getJoke} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:translate-y-1 transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          <svg className={`w-6 h-6 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path>
          </svg>
          {loading ? 'Cargando...' : '¡Nuevo chiste!'}
        </button>
      </div>
      <footer className="text-white/50 mt-8 text-sm">
        Powered by Go & React
      </footer>
    </div>
  );
}

export default Jokes;
