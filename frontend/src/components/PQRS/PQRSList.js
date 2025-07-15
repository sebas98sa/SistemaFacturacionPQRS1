// frontend/src/components/PQRS/PQRSList.js
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

function PQRSList() {
    const [pqrsList, setPqrsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        fetch('/api/pqrs', {
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
                setPqrsList(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener PQRS:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar este PQRS?')) {
            try {
                const response = await fetch(`/api/pqrs/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setPqrsList(pqrsList.filter(pqrs => pqrs.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar PQRS: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar PQRS:", err);
                alert("No se pudo conectar con el servidor para eliminar el PQRS.");
            }
        }
    };

    if (loading) {
        return <Typography>Cargando PQRS...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de PQRS
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/pqrs/new"
                sx={{ mb: 2 }}
            >
                Nuevo PQRS
            </Button>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Asunto</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Prioridad</TableCell>
                            <TableCell>Fecha Creación</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pqrsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No hay PQRS registrados.</TableCell>
                            </TableRow>
                        ) : (
                            pqrsList.map(pqrs => (
                                <TableRow key={pqrs.id}>
                                    <TableCell>{pqrs.cliente ? pqrs.cliente.nombre : 'N/A'}</TableCell>
                                    <TableCell>{pqrs.asunto}</TableCell>
                                    <TableCell>{pqrs.estado}</TableCell>
                                    <TableCell>{pqrs.prioridad}</TableCell>
                                    <TableCell>{new Date(pqrs.fechaCreacion).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/pqrs/edit/${pqrs.id}`}
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(pqrs.id)}
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

export default PQRSList;
