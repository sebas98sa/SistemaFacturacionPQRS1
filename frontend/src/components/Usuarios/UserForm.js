// frontend/src/components/Usuarios/UserForm.js
import React, { useState, useEffect } from 'react'; // <-- LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nombre: '', email: '', password: '', rol: 'USUARIO', enabled: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        if (id) {
            setLoading(true);
            fetch(`/api/usuarios/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                        navigate('/');
                        throw new Error('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
                    }
                    if (!response.ok) throw new Error('Usuario no encontrado.');
                    return response.json();
                })
                .then(data => {
                    // No cargar la contraseña real por seguridad
                    setUser({ ...data, password: '' });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/usuarios/${id}` : '/api/usuarios';
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                navigate('/usuarios');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el usuario.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Typography>Cargando datos del usuario...</Typography>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 64px)', // Ajustar para el AppBar
                p: 3
            }}
        >
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: 500, maxWidth: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {id ? 'Editar Usuario' : 'Agregar Usuario'}
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
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        value={user.nombre}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        variant="outlined"
                        required={!id} // Requerido solo al crear
                    />
                    {!id && (
                        <Typography variant="caption" display="block" sx={{ mt: -1, mb: 1 }}>
                            La contraseña es requerida para nuevos usuarios.
                        </Typography>
                    )}
                    {id && (
                        <Typography variant="caption" display="block" sx={{ mt: -1, mb: 1 }}>
                            Deja en blanco para no cambiar la contraseña.
                        </Typography>
                    )}
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="rol-select-label">Rol</InputLabel>
                        <Select
                            labelId="rol-select-label"
                            id="rol-select"
                            name="rol"
                            value={user.rol}
                            label="Rol"
                            onChange={handleChange}
                        >
                            <MenuItem value="USUARIO">USUARIO</MenuItem>
                            <MenuItem value="EMPLEADO">EMPLEADO</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={user.enabled}
                                onChange={handleChange}
                                name="enabled"
                                color="primary"
                            />
                        }
                        label="Habilitado"
                        sx={{ mt: 1, mb: 2, display: 'block' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            Guardar Usuario
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/usuarios')}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default UserForm;
