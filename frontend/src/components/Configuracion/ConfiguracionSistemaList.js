// frontend/src/components/Configuracion/ConfiguracionSistemaList.js
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

function ConfiguracionSistemaList() {
    const [configuraciones, setConfiguraciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        fetch('/api/configuracion', {
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
                setConfiguraciones(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener configuraciones:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar esta configuración?')) {
            try {
                const response = await fetch(`/api/configuracion/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setConfiguraciones(configuraciones.filter(config => config.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar configuración: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar configuración:", err);
                alert("No se pudo conectar con el servidor para eliminar la configuración.");
            }
        }
    };

    if (loading) {
        return <Typography>Cargando configuraciones...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Configuración del Sistema
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/configuracion/new"
                sx={{ mb: 2 }}
            >
                Agregar Configuración
            </Button>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Clave</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {configuraciones.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay configuraciones registradas.</TableCell>
                            </TableRow>
                        ) : (
                            configuraciones.map(config => (
                                <TableRow key={config.id}>
                                    <TableCell>{config.clave}</TableCell>
                                    <TableCell>{config.valor}</TableCell>
                                    <TableCell>{config.descripcion}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/configuracion/edit/${config.id}`}
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(config.id)}
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

export default ConfiguracionSistemaList;
