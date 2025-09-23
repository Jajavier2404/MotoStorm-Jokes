import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './store/estilo.css';
import LoginModal from './login'; // Asegúrate de importar tu modal o definirlo aquí mismo

import boxengasse from './store/img/boxengasse.png';
import englishrose from './store/img/englishrose.png';
import knocknap from './store/img/knocknap.png';
import lanight from './store/img/lanight.png';
import silverall from './store/img/silverall.png';
import skinglam from './store/img/skinglam.png';
import midimix from './store/img/midimix.png';
import sirblue from './store/img/sirblue.png';
import middlesteel from './store/img/middlesteel.png';

const productsData = [
    { id: 1, name: 'Box Engasse', price: 15000, image: boxengasse },
    { id: 2, name: 'English Horse', price: 25000, image: englishrose },
    { id: 3, name: 'Knock Nap', price: 35000, image: knocknap },
    { id: 4, name: 'La Night', price: 18000, image: lanight },
    { id: 5, name: 'Silver All', price: 32000, image: silverall },
    { id: 6, name: 'Skin Glam', price: 18000, image: skinglam },
    { id: 7, name: 'Midimix', price: 54000, image: midimix },
    { id: 8, name: 'Sir Blue', price: 32000, image: sirblue },
    { id: 9, name: 'Middlesteel', price: 42800, image: middlesteel },
];

function CarStore() {
  // Aquí dentro van todos los hooks y funciones
  const [products, setProducts] = useState(productsData);
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd decode the token or make an API call to get user details
      // For now, we'll just set a mock user based on the presence of a token
      setCurrentUser({ name: "Usuario", token: token }); // Placeholder name
    }

    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = 'white';
    document.documentElement.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
    };
  }, []);

  const handleAddToCart = (product) => {
    setCartVisible(true);
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const handleRemoveFromCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  const handleDeleteFromCart = (product) => {
    setCartItems(cartItems.filter((x) => x.id !== product.id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((price, item) => price + item.qty * item.price, 0);
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setCartVisible(false);
    }
  }, [cartItems]);

  const handlePayment = async () => {
    if (currentUser) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No hay token de autenticación. Por favor, inicie sesión de nuevo.");
        setShowLogin(true);
        return;
      }

      try {
        const itemsToPurchase = cartItems.map(item => ({
          id: item.id,
          qty: item.qty
        }));

        await axios.post('http://localhost:8082/api/reloj/purchase', { items: itemsToPurchase }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert(`Gracias por su compra, ${currentUser.name}!`);
        setCartItems([]); // Limpia carrito después de comprar
      } catch (error) {
        console.error("Error al realizar la compra:", error);
        alert("Error al procesar la compra. Por favor, intente de nuevo.");
      }
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {showLogin && (
        <LoginModal
          setShowLogin={setShowLogin}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          onLoginSuccess={setCurrentUser}
        />
      )}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          borderBottom: '1px solid #eee',
        }}
      >
        <h1>Tienda de Relojes</h1>
        <div>
          {currentUser ? (
            <div className="flex items-center">
              <span className="mr-4">
                Bienvenido, <span className="font-bold">{currentUser.name}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setCurrentUser(null);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </header>
      <section className="contenedor">
        <div className="contenedor-items">
          {products.map((product) => (
            <div className="item" key={product.id}>
              <span className="titulo-item">{product.name}</span>
              <img src={product.image} alt={product.name} className="img-item" />
              <span className="precio-item">${product.price.toLocaleString('es-CO')}</span>
              <button
                className="boton-item"
                onClick={() => handleAddToCart(product)}
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
        <div
          className="carrito"
          style={{
            marginRight: cartVisible ? '0' : '-100%',
            opacity: cartVisible ? '1' : '0',
          }}
        >
          <div className="header-carrito">
            <h2>Tu Carrito</h2>
          </div>
          <div className="carrito-items">
            {cartItems.length === 0 && <div className="p-4">El carrito está vacío</div>}
            {cartItems.map((item) => (
              <div className="carrito-item" key={item.id}>
                <img src={item.image} width="80px" alt={item.name} />
                <div className="carrito-item-detalles">
                  <span className="carrito-item-titulo">{item.name}</span>
                  <div className="selector-cantidad">
                    <i
                      className="fa-solid fa-minus restar-cantidad"
                      onClick={() => handleRemoveFromCart(item)}
                    ></i>
                    <input
                      type="text"
                      value={item.qty}
                      className="carrito-item-cantidad"
                      readOnly
                    />
                    <i
                      className="fa-solid fa-plus sumar-cantidad"
                      onClick={() => handleAddToCart(item)}
                    ></i>
                  </div>
                  <span className="carrito-item-precio">
                    ${(item.price * item.qty).toLocaleString('es-CO')}
                  </span>
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => handleDeleteFromCart(item)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="carrito-total">
            <div className="fila">
              <strong>Tu Total</strong>
              <span className="carrito-precio-total">${getTotalPrice().toLocaleString('es-CO')}</span>
            </div>
            <button className="btn-pagar" onClick={handlePayment}>
              Pagar <i className="fa-solid fa-bag-shopping"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CarStore;
