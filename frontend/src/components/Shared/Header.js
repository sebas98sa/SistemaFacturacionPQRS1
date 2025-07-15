// frontend/src/components/Shared/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';

function Header({ title }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Limpiar la información de autenticación del localStorage
        localStorage.removeItem('jwtToken'); // <-- Limpiar el JWT
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');

        // Redirigir al usuario a la página de inicio de sesión
        navigate('/');
    };

    const userEmail = localStorage.getItem('userEmail');

    return (
        <header className="app-header">
            <div className="header-left">
                <img src={logo} className="App-logo" alt="logo" style={{height: '50px'}} />
                <h1>{title}</h1>
            </div>
            <div className="header-right">
                {userEmail && <span>Bienvenido, {userEmail}!</span>}
                <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </header>
    );
}

export default Header;
