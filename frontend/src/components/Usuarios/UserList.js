// frontend/src/components/Usuarios/UserList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        // Esta API debería estar protegida y solo accesible por administradores
        fetch('/api/usuarios', {
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
                    throw new Error('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuarios:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`/api/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar usuario: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar usuario:", err);
                alert("No se pudo conectar con el servidor para eliminar el usuario.");
            }
        }
    };

    if (loading) {
        return <Typography>Cargando usuarios...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error.message}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Usuarios y Roles
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/usuarios/new"
                sx={{ mb: 2 }}
            >
                Agregar Usuario
            </Button>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Habilitado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No hay usuarios registrados.</TableCell>
                            </TableRow>
                        ) : (
                            users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.nombre}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.rol}</TableCell>
                                    <TableCell>
                                        <Checkbox checked={user.enabled} disabled />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/usuarios/edit/${user.id}`}
                                            sx={{ mr: 1 }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(user.id)}
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

export default UserList;
