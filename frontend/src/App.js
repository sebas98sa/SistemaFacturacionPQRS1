// frontend/src/App.js (Ajustes para el Layout MUI)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'; // Estilos globales (mantener para estilos personalizados no cubiertos por MUI)

// Componentes de Autenticación
import LoginForm from './components/Auth/LoginForm';
import ForgotPassword from './components/Auth/ForgotPassword';
import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';

// Componentes del Dashboard y Layout
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Shared/Header';
import Sidebar from './components/Dashboard/Sidebar';

// Componentes de Gestión
import ProductoList from './components/Productos/ProductoList';
import ProductoForm from './components/Productos/ProductoForm';
import ClienteList from './components/Clientes/ClienteList';
import ClienteForm from './components/Clientes/ClienteForm';
import FacturaList from './components/Facturas/FacturaList';
import FacturaForm from './components/Facturas/FacturaForm';
import PQRSList from './components/PQRS/PQRSList';
import PQRSForm from './components/PQRS/PQRSForm';
import MetodoPagoList from './components/MetodosPago/MetodoPagoList';
import MetodoPagoForm from './components/MetodosPago/MetodoPagoForm';
import ConfiguracionSistemaList from './components/Configuracion/ConfiguracionSistemaList';
import ConfiguracionSistemaForm from './components/Configuracion/ConfiguracionSistemaForm';
import UserList from './components/Usuarios/UserList';
import UserForm from './components/Usuarios/UserForm';

// Importaciones de MUI para el layout principal
import { Box, Toolbar } from '@mui/material';


// Componente de Layout condicional
function Layout() {
    const location = useLocation();
    const noLayoutPaths = ['/', '/forgot-password', '/oauth2/redirect'];
    const showLayout = !noLayoutPaths.includes(location.pathname);

    return (
        <Box sx={{ display: 'flex' }}> {/* Contenedor principal para el layout */}
            {showLayout && (
                <>
                    <Header title="CEDEUNION" />
                    <Sidebar />
                </>
            )}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: showLayout ? `calc(100% - 240px)` : '100%', // Ajusta el ancho si el sidebar está presente
                    ml: showLayout ? '240px' : 0, // Margen izquierdo si el sidebar está presente
                }}
            >
                {showLayout && <Toolbar />} {/* Espacio para el AppBar */}
                <Routes>
                    {/* Rutas de Autenticación */}
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    {/* Rutas del Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Rutas de Gestión */}
                    <Route path="/productos" element={<ProductoList />} />
                    <Route path="/productos/new" element={<ProductoForm />} />
                    <Route path="/productos/edit/:id" element={<ProductoForm />} />

                    <Route path="/clientes" element={<ClienteList />} />
                    <Route path="/clientes/new" element={<ClienteForm />} />
                    <Route path="/clientes/edit/:id" element={<ClienteForm />} />

                    <Route path="/facturas" element={<FacturaList />} />
                    <Route path="/facturas/new" element={<FacturaForm />} />
                    <Route path="/facturas/edit/:id" element={<FacturaForm />} />

                    <Route path="/pqrs" element={<PQRSList />} />
                    <Route path="/pqrs/new" element={<PQRSForm />} />
                    <Route path="/pqrs/edit/:id" element={<PQRSForm />} />

                    <Route path="/metodospago" element={<MetodoPagoList />} />
                    <Route path="/metodospago/new" element={<MetodoPagoForm />} />
                    <Route path="/metodospago/edit/:id" element={<MetodoPagoForm />} />

                    <Route path="/configuracion" element={<ConfiguracionSistemaList />} />
                    <Route path="/configuracion/new" element={<ConfiguracionSistemaForm />} />
                    <Route path="/configuracion/edit/:id" element={<ConfiguracionSistemaForm />} />

                    <Route path="/usuarios" element={<UserList />} />
                    <Route path="/usuarios/new" element={<UserForm />} />
                    <Route path="/usuarios/edit/:id" element={<UserForm />} />

                </Routes>
            </Box>
        </Box>
    );
}

function AppWrapper() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default AppWrapper;
