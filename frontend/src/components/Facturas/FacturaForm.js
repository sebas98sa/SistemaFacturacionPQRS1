// frontend/src/components/Facturas/FacturaForm.js
import React, { useState, useEffect } from 'react'; // <-- LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function FacturaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState({
        cliente: null, // Objeto Cliente completo o solo su ID
        fecha: '', // Se llenará automáticamente en el backend o se seleccionará
        total: 0,
        estado: 'Pendiente'
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

        if (id) { // Si estamos editando, cargar datos de la factura
            setLoading(true);
            fetch(`/api/facturas/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('Factura no encontrada.');
                    return response.json();
                })
                .then(data => {
                    setFactura({
                        ...data,
                        // Asegurarse de que el cliente sea un objeto con ID si es necesario para el selector
                        cliente: data.cliente ? data.cliente.id : '' // Usar '' para que el select no dé error si cliente es null
                    });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, navigate]); // Añadir navigate a las dependencias

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFactura(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        setFactura(prev => ({
            ...prev,
            cliente: clienteId ? { id: parseInt(clienteId) } : null // Si no se selecciona nada, enviar null
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/facturas/${id}` : '/api/facturas';
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
                body: JSON.stringify(factura),
            });

            if (response.ok) {
                navigate('/facturas');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar la factura.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar la factura.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <Typography>Cargando datos de la factura...</Typography>;
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
                    {id ? 'Editar Factura' : 'Crear Factura'}
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
                            value={factura.cliente ? factura.cliente.id : ''}
                            label="Cliente"
                            onChange={handleClienteChange}
                        >
                            <option value="">
                                <em>Seleccione un cliente</em>
                            </option>
                            {clientes.map(cli => (
                                <MenuItem key={cli.id} value={cli.id}>{cli.nombre} ({cli.email})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="total"
                        label="Total"
                        name="total"
                        type="number"
                        value={factura.total}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="estado-select-label">Estado</InputLabel>
                        <Select
                            labelId="estado-select-label"
                            id="estado-select"
                            name="estado"
                            value={factura.estado}
                            label="Estado"
                            onChange={handleChange}
                        >
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="Pagada">Pagada</MenuItem>
                            <MenuItem value="Vencida">Vencida</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            Guardar Factura
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/facturas')}
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

export default FacturaForm;
