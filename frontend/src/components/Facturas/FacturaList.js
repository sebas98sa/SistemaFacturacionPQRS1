// frontend/src/components/Facturas/FacturaList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function FacturaList() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken'); // Obtener el JWT
        if (!jwtToken) {
            navigate('/'); // Redirigir al login si no hay token
            return;
        }

        fetch('/api/facturas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`, // Enviar el JWT
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
                setFacturas(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener facturas:", error);
                setError(error);
                setLoading(false);
            });
    }, [navigate]); // Añadir navigate a las dependencias del useEffect

    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
            try {
                const response = await fetch(`/api/facturas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`, // Incluir JWT
                    },
                });

                if (response.ok) {
                    setFacturas(facturas.filter(factura => factura.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar factura: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar factura:", err);
                alert("No se pudo conectar con el servidor para eliminar la factura.");
            }
        }
    };

    if (loading) {
        return <Typography>Cargando facturas...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Facturas
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/facturas/new"
                sx={{ mb: 2 }}
            >
                Nueva Factura
            </Button>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facturas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No hay facturas registradas.</TableCell>
                            </TableRow>
                        ) : (
                            facturas.map(factura => (
                                <TableRow key={factura.id}>
                                    <TableCell>{factura.cliente ? factura.cliente.nombre : 'N/A'}</TableCell>
                                    <TableCell>{factura.fecha}</TableCell>
                                    <TableCell>${factura.total ? factura.total.toFixed(2) : '0.00'}</TableCell>
                                    <TableCell>{factura.estado}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/facturas/edit/${factura.id}`}
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(factura.id)}
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

export default FacturaList;
