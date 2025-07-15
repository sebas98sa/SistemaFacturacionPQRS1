// frontend/src/components/PQRS/PQRSForm.js
import React, { useState, useEffect } from 'react'; // <-- LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function PQRSForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pqrs, setPqrs] = useState({
        cliente: null, // Objeto Cliente o solo su ID
        asunto: '',
        descripcion: '',
        estado: 'Abierto', // Estado inicial por defecto
        prioridad: 'Media' // Prioridad inicial por defecto
    });
    const [clientes, setClientes] = useState([]); // Para la lista desplegable de clientes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        // Cargar lista de clientes para el selector
        fetch('/api/clientes', {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                }
                return response.json();
            })
            .then(data => setClientes(data))
            .catch(err => console.error("Error al cargar clientes:", err));

        if (id) { // Si estamos editando, cargar datos del PQRS
            setLoading(true);
            fetch(`/api/pqrs/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('PQRS no encontrado.');
                    return response.json();
                })
                .then(data => {
                    setPqrs({
                        ...data,
                        cliente: data.cliente ? data.cliente.id : ''
                    });
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
        setPqrs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        setPqrs(prev => ({
            ...prev,
            cliente: clienteId ? { id: parseInt(clienteId) } : null
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/pqrs/${id}` : '/api/pqrs';
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
                body: JSON.stringify(pqrs),
            });

            if (response.ok) {
                navigate('/pqrs'); // Redirige a la lista de PQRS
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el PQRS.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el PQRS.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Typography>Cargando datos del PQRS...</Typography>;
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
                    {id ? 'Editar PQRS' : 'Crear Nuevo PQRS'}
                </Typography>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="cliente-select-label">Cliente</InputLabel>
                        <Select
                            labelId="cliente-select-label"
                            id="cliente-select"
                            name="cliente"
                            value={pqrs.cliente ? pqrs.cliente.id : ''}
                            label="Cliente"
                            onChange={handleClienteChange}
                        >
                            <MenuItem value="">
                                <em>Seleccione un cliente</em>
                            </MenuItem>
                            {clientes.map(cli => (
                                <MenuItem key={cli.id} value={cli.id}>{cli.nombre} ({cli.email})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="asunto"
                        label="Asunto"
                        name="asunto"
                        value={pqrs.asunto}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="descripcion"
                        label="Descripción"
                        name="descripcion"
                        value={pqrs.descripcion}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="estado-select-label">Estado</InputLabel>
                        <Select
                            labelId="estado-select-label"
                            id="estado-select"
                            name="estado"
                            value={pqrs.estado}
                            label="Estado"
                            onChange={handleChange}
                        >
                            <MenuItem value="Abierto">Abierto</MenuItem>
                            <MenuItem value="En Proceso">En Proceso</MenuItem>
                            <MenuItem value="Resuelto">Resuelto</MenuItem>
                            <MenuItem value="Cerrado">Cerrado</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="prioridad-select-label">Prioridad</InputLabel>
                        <Select
                            labelId="prioridad-select-label"
                            id="prioridad-select"
                            name="prioridad"
                            value={pqrs.prioridad}
                            label="Prioridad"
                            onChange={handleChange}
                        >
                            <MenuItem value="Baja">Baja</MenuItem>
                            <MenuItem value="Media">Media</MenuItem>
                            <MenuItem value="Alta">Alta</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            Guardar PQRS
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/pqrs')}
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

export default PQRSForm;

