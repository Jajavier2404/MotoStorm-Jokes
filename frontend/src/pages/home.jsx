import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, Car, Cloud } from 'lucide-react';

function Home() {
  const features = [
    {
      path: '/jokes',
      icon: <Smile className="w-12 h-12 text-blue-500" />,
      title: 'Chistes de Chuck Norris',
      description: 'Una dosis diaria de humor con los mejores chistes del único e inigualable Chuck Norris.',
      buttonText: 'Ver Chistes',
      color: 'blue',
    },
    {
      path: '/car-store',
      icon: <Car className="w-12 h-12 text-red-500" />,
      title: 'Tienda de Relojes',
      description: 'Explora nuestra exclusiva colección de relojes de lujo. Encuentra el estilo perfecto para ti.',
      buttonText: 'Ir a la Tienda',
      color: 'red',
    },
    {
      path: '/weather',
      icon: <Cloud className="w-12 h-12 text-green-500" />,
      title: 'Consulta el Clima',
      description: 'Obtén el pronóstico del tiempo en tiempo real para cualquier ciudad del mundo.',
      buttonText: 'Ver Clima',
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Bienvenido a MotoStorm-Jokes
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12">
          Tu portal de entretenimiento y utilidades. Explora nuestras secciones:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div 
            key={feature.path}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out border-t-4 border-${feature.color}-500`}
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className={`bg-${feature.color}-100 dark:bg-gray-700 p-4 rounded-full mb-6`}>
                {feature.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{feature.description}</p>
              <Link to={feature.path}>
                <button className={`w-full bg-${feature.color}-500 hover:bg-${feature.color}-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300`}>
                  {feature.buttonText}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center text-gray-500 dark:text-gray-400 mt-16">
        <p>&copy; 2025 MotoStorm Jokes. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
