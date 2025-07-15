// frontend/src/components/Auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Button, TextField, Typography, Paper, Link as MuiLink // Renombrar Link para evitar conflicto
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Icono de Google

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
                localStorage.setItem('jwtToken', data.jwtToken);
                localStorage.setItem('userRole', data.userRole);
                localStorage.setItem('userEmail', data.userEmail);
                navigate('/dashboard');
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

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorize/google';
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.default', // Usar color del tema
            }}
        >
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: 'center', width: 350 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Inicio de Sesión
                </Typography>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar sesión
                    </Button>
                    <MuiLink component="button" variant="body2" onClick={handleForgotPassword} sx={{ mt: 1 }}>
                        Recuperar contraseña
                    </MuiLink>
                    <Button
                        fullWidth
                        variant="outlined" // O contained, según tu preferencia
                        sx={{ mt: 2, mb: 1, backgroundColor: '#4285f4', color: 'white', '&:hover': { backgroundColor: '#357ae8' } }}
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                    >
                        Iniciar sesión con Google
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default LoginForm;
