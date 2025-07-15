// frontend/src/components/Auth/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/auth/recuperar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const result = await response.text();
                setMessage(result || 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.');
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al procesar la solicitud.');
            }
        } catch (err) {
            console.error('Error de red o del servidor:', err);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h2>Recuperar Contraseña</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar</button>
                <p className="back-to-login" onClick={() => navigate('/')}>
                    Volver al inicio de sesión
                </p>
            </form>
        </div>
    );
}

export default ForgotPassword;