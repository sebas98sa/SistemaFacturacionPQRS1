// frontend/src/components/Dashboard/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
// Importaciones de MUI
import {
    Box, Grid, Paper, Typography, Card, CardContent, List, ListItem, ListItemText, Button
} from '@mui/material';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';

function Dashboard() {
    // Simular datos para gráficos y notificaciones (reemplazar con llamadas a la API)
    const totalFacturado = "$50,000";
    const pagosPendientes = "$10,000";
    const ticketsAbiertos = 5;
    const ticketsEnProceso = 3;
    const notificaciones = [
        "Factura #2023-001 ha sido pagada.",
        "Nuevo PQRS: Queja de Juan Pérez.",
        "Recordatorio: Pago pendiente de Cliente A.",
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Header title="CEDEUNION" />
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' /* Para dejar espacio al Header */ }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Total Facturado
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {totalFacturado}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Pagos Pendientes
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {pagosPendientes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Tickets Abiertos
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {ticketsAbiertos}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Tickets en Proceso
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {ticketsEnProceso}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Gráficos de Ventas
                            </Typography>
                            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200', borderRadius: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Gráfico de Ventas Mostrando Tendencias (20%, 50%, 10%)
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Notificaciones Recientes
                            </Typography>
                            <List>
                                {notificaciones.map((notif, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemText primary={notif} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Acceso Rápido a Módulos
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        <Button component={Link} to="/clientes" variant="outlined">Gestión de Clientes</Button>
                        <Button component={Link} to="/facturas" variant="outlined">Gestión de Facturas</Button>
                        <Button component={Link} to="/productos" variant="outlined">Gestión de Productos</Button>
                        <Button component={Link} to="/pqrs" variant="outlined">PQRS</Button>
                        <Button component={Link} to="/metodospago" variant="outlined">Métodos de Pago</Button>
                        <Button component={Link} to="/configuracion" variant="outlined">Configuración de Sistema</Button>
                        <Button component={Link} to="/usuarios" variant="outlined">Gestión de Usuarios y Roles</Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default Dashboard;
