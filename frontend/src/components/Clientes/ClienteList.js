// frontend/src/components/Clientes/ClienteForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function ClienteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nombre: '', email: '', direccion: '', telefono: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        if (id) { // Si hay un ID, estamos editando
            setLoading(true);
            fetch(`/api/clientes/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('Cliente no encontrado.');
                    return response.json();
                })
                .then(data => {
                    setCliente(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/clientes/${id}` : '/api/clientes';
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
                body: JSON.stringify(cliente),
            });

            if (response.ok) {
                navigate('/clientes');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el cliente.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el cliente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Typography>Cargando datos del cliente...</Typography>;
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
                    {id ? 'Editar Cliente' : 'Agregar Cliente'}
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
                        value={cliente.nombre}
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
                        value={cliente.email}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="telefono"
                        label="Teléfono"
                        name="telefono"
                        value={cliente.telefono}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="direccion"
                        label="Dirección"
                        name="direccion"
                        value={cliente.direccion}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            Guardar Cliente
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/clientes')}
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

export default ClienteForm;
