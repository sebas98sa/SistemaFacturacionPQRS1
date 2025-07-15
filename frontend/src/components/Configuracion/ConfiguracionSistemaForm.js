// frontend/src/components/Configuracion/ConfiguracionSistemaForm.js
import React, { useState, useEffect } from 'react'; // <-- LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Button, TextField, Typography, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function ConfiguracionSistemaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [configuracion, setConfiguracion] = useState({
        clave: '', valor: '', descripcion: ''
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
            fetch(`/api/configuracion/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('Configuración no encontrada.');
                    return response.json();
                })
                .then(data => {
                    setConfiguracion(data);
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
        setConfiguracion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/configuracion/${id}` : '/api/configuracion';
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
                body: JSON.stringify(configuracion),
            });

            if (response.ok) {
                navigate('/configuracion');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar la configuración.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar la configuración.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Typography>Cargando datos de configuración...</Typography>;
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
                    {id ? 'Editar Configuración' : 'Agregar Configuración'}
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
                        id="clave"
                        label="Clave"
                        name="clave"
                        value={configuracion.clave}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="valor"
                        label="Valor"
                        name="valor"
                        value={configuracion.valor}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="descripcion"
                        label="Descripción"
                        name="descripcion"
                        value={configuracion.descripcion}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            Guardar Configuración
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/configuracion')}
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

export default ConfiguracionSistemaForm;
