// frontend/src/components/Auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Inicio de sesión exitoso:', data);
                // Guarda el token JWT y el rol del usuario en localStorage
                localStorage.setItem('jwtToken', data.jwtToken); // <-- Guarda el JWT
                localStorage.setItem('userRole', data.userRole); // Guarda el rol (opcional, para lógica de frontend)
                localStorage.setItem('userEmail', data.userEmail); // Guarda el email (opcional)

                navigate('/dashboard'); // Redirige al dashboard
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al iniciar sesión. Credenciales inválidas.');
            }
        } catch (err) {
            console.error('Error de red o del servidor:', err);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Inicio de Sesión</h2>
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
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar sesión</button>
                <p className="forgot-password-link" onClick={handleForgotPassword}>
                    Recuperar contraseña
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
