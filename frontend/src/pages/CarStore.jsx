import React, { useState, useEffect } from 'react';
import './store/estilo.css';

// Import images
import boxengasse from './store/img/boxengasse.png';
import englishrose from './store/img/englishrose.png';
import knocknap from './store/img/knocknap.png';
import lanight from './store/img/lanight.png';
import silverall from './store/img/silverall.png';
import skinglam from './store/img/skinglam.png';
import midimix from './store/img/midimix.png';
import sirblue from './store/img/sirblue.png';
import middlesteel from './store/img/middlesteel.png';

const products = [
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
    const [cartItems, setCartItems] = useState([]);
    const [cartVisible, setCartVisible] = useState(false);

    // Efecto para aplicar fondo blanco a toda la página
    useEffect(() => {
        // Guardar el fondo original
        const originalBodyBg = document.body.style.backgroundColor;
        const originalHtmlBg = document.documentElement.style.backgroundColor;

        // Aplicar fondo blanco
        document.body.style.backgroundColor = 'white';
        document.documentElement.style.backgroundColor = 'white';

        // Limpiar al desmontar el componente
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

    return (
        <div style={{
            backgroundColor: 'white',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            zIndex: 1
        }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <header>
                <h1>Tienda de Relojes</h1>
            </header>
            <section className="contenedor">
                <div className="contenedor-items">
                    {products.map((product) => (
                        <div className="item" key={product.id}>
                            <span className="titulo-item">{product.name}</span>
                            <img src={product.image} alt={product.name} className="img-item" />
                            <span className="precio-item">${product.price.toLocaleString('es-CO')}</span>
                            <button className="boton-item" onClick={() => handleAddToCart(product)}>Agregar al Carrito</button>
                        </div>
                    ))}
                </div>
                <div className="carrito" style={{ marginRight: cartVisible ? '0' : '-100%', opacity: cartVisible ? '1' : '0' }}>
                    <div className="header-carrito">
                        <h2>Tu Carrito</h2>
                    </div>
                    <div className="carrito-items">
                        {cartItems.length === 0 && <div>El carrito está vacío</div>}
                        {cartItems.map((item) => (
                            <div className="carrito-item" key={item.id}>
                                <img src={item.image} width="80px" alt={item.name} />
                                <div className="carrito-item-detalles">
                                    <span className="carrito-item-titulo">{item.name}</span>
                                    <div className="selector-cantidad">
                                        <i className="fa-solid fa-minus restar-cantidad" onClick={() => handleRemoveFromCart(item)}></i>
                                        <input type="text" value={item.qty} className="carrito-item-cantidad" readOnly />
                                        <i className="fa-solid fa-plus sumar-cantidad" onClick={() => handleAddToCart(item)}></i>
                                    </div>
                                    <span className="carrito-item-precio">${(item.price * item.qty).toLocaleString('es-CO')}</span>
                                </div>
                                <button className="btn-eliminar" onClick={() => handleDeleteFromCart(item)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="carrito-total">
                        <div className="fila">
                            <strong>Tu Total</strong>
                            <span className="carrito-precio-total">
                                ${getTotalPrice().toLocaleString('es-CO')}
                            </span>
                        </div>
                        <button className="btn-pagar" onClick={() => alert('Gracias por su compra!')}>Pagar <i className="fa-solid fa-bag-shopping"></i></button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CarStore;
