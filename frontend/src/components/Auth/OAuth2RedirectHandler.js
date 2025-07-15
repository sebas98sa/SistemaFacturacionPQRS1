// frontend/src/components/Auth/OAuth2RedirectHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('Iniciando sesión con Google...');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJwtToken = async () => {
            try {
                // Llama al endpoint del backend que genera el JWT después de la autenticación de Google
                const response = await fetch('/api/auth/google-login-success'); // Este endpoint obtiene el JWT de la sesión de Spring Security

                if (response.ok) {
                    const data = await response.json();
                    console.log('Inicio de sesión exitoso (Google):', data);
                    localStorage.setItem('jwtToken', data.jwtToken);
                    localStorage.setItem('userRole', data.userRole);
                    localStorage.setItem('userEmail', data.userEmail);
                    setMessage('¡Inicio de sesión con Google exitoso! Redirigiendo...');
                    navigate('/dashboard'); // Redirige al dashboard
                } else {
                    const errorText = await response.text();
                    setError(errorText || 'Error al obtener el token JWT después del inicio de sesión con Google.');
                    console.error('Error en google-login-success:', errorText);
                    setMessage('Error al iniciar sesión con Google.');
                    // Opcional: redirigir al login con un mensaje de error
                    // navigate('/?error=oauth2_failed');
                }
            } catch (err) {
                setError('Error de red al intentar obtener el token JWT.');
                console.error('Error de red:', err);
                setMessage('Error de conexión al iniciar sesión con Google.');
            }
        };

        fetchJwtToken();
    }, [navigate]);

    return (
        <div className="oauth2-redirect-container">
            {message && <p>{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {/* Puedes añadir un spinner de carga aquí */}
        </div>
    );
}

export default OAuth2RedirectHandler;
