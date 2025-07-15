// frontend/src/components/MetodosPago/MetodoPagoList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Checkbox, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function MetodoPagoList() {
    const [metodosPago, setMetodosPago] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        fetch('/api/metodospago', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    throw new Error('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMetodosPago(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener métodos de pago:", error);
                setError(error);
                setLoading(false);
            });
    }, [navigate]);

    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            try {
                const response = await fetch(`/api/metodospago/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setMetodosPago(metodosPago.filter(metodo => metodo.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar método de pago: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar método de pago:", err);
                alert("No se pudo conectar con el servidor para eliminar el método de pago.");
            }
        }
    };

    if (loading) {
        return <Typography>Cargando métodos de pago...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Métodos de Pago
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/metodospago/new"
                sx={{ mb: 2 }}
            >
                Agregar Método de Pago
            </Button>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metodosPago.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay métodos de pago registrados.</TableCell>
                            </TableRow>
                        ) : (
                            metodosPago.map(metodo => (
                                <TableRow key={metodo.id}>
                                    <TableCell>{metodo.nombre}</TableCell>
                                    <TableCell>{metodo.descripcion}</TableCell>
                                    <TableCell>
                                        <Checkbox checked={metodo.activo} disabled />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/metodospago/edit/${metodo.id}`}
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(metodo.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MetodoPagoList;
