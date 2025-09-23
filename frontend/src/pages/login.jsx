import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

function LoginModal({ setShowLogin, isRegister, setIsRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8082/api/reloj/login', { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        onLoginSuccess({ name: email.split('@')[0], token: response.data.token });
        setShowLogin(false);
      }
    } catch (err) {
      setError(err.response?.data || 'Credenciales inválidas o error de conexión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:8082/api/reloj/register', { email, password });
      if (response.status === 201) {
        // Login automático después de registrarse
        await handleLogin(e);
      } else {
        setError(response.data || 'Error al registrarse');
      }
    } catch (err) {
      setError(err.response?.data || 'Error al registrarse');
    }
  };

  return (
    <div onClick={() => setShowLogin(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-8 max-w-sm w-full relative text-gray-800">
        <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {isRegister && (
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="******************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              {isRegister
                ? '¿Ya tienes cuenta? Inicia Sesión'
                : 'Crear una cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;