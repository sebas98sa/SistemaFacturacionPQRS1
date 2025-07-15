// frontend/src/App.js (Actualización Completa de Rutas)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'; // Estilos globales

// Componentes de Autenticación
import LoginForm from './components/Auth/LoginForm';
import ForgotPassword from './components/Auth/ForgotPassword';

// Componentes del Dashboard y Layout
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Shared/Header';
import Sidebar from './components/Dashboard/Sidebar';

// Componentes de Gestión (¡Imports necesarios!)
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


// Componente de Layout condicional
function Layout() {
    const location = useLocation();
    // Rutas donde NO se muestra el layout completo (Header y Sidebar)
    const noLayoutPaths = ['/', '/forgot-password'];
    const showLayout = !noLayoutPaths.includes(location.pathname);

    return (
        <div className="App">
            {showLayout && (
                <>
                    <Header title="CEDEUNION" />
                    <Sidebar />
                </>
            )}
            <main className={showLayout ? "content-with-sidebar" : ""}>
                <Routes>
                    {/* Rutas de Autenticación */}
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Rutas del Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Rutas del Módulo de Productos */}
                    <Route path="/productos" element={<ProductoList />} />
                    <Route path="/productos/new" element={<ProductoForm />} />
                    <Route path="/productos/edit/:id" element={<ProductoForm />} />

                    {/* Rutas del Módulo de Clientes */}
                    <Route path="/clientes" element={<ClienteList />} />
                    <Route path="/clientes/new" element={<ClienteForm />} />
                    <Route path="/clientes/edit/:id" element={<ClienteForm />} />

                    {/* Rutas del Módulo de Facturas */}
                    <Route path="/facturas" element={<FacturaList />} />
                    <Route path="/facturas/new" element={<FacturaForm />} />
                    <Route path="/facturas/edit/:id" element={<FacturaForm />} />

                    {/* Rutas del Módulo de PQRS */}
                    <Route path="/pqrs" element={<PQRSList />} />
                    <Route path="/pqrs/new" element={<PQRSForm />} />
                    <Route path="/pqrs/edit/:id" element={<PQRSForm />} />

                    {/* Rutas del Módulo de Métodos de Pago */}
                    <Route path="/metodospago" element={<MetodoPagoList />} />
                    <Route path="/metodospago/new" element={<MetodoPagoForm />} />
                    <Route path="/metodospago/edit/:id" element={<MetodoPagoForm />} />

                    {/* Rutas del Módulo de Configuración de Sistema */}
                    <Route path="/configuracion" element={<ConfiguracionSistemaList />} />
                    <Route path="/configuracion/new" element={<ConfiguracionSistemaForm />} />
                    <Route path="/configuracion/edit/:id" element={<ConfiguracionSistemaForm />} />

                    {/* Rutas del Módulo de Gestión de Usuarios y Roles */}
                    <Route path="/usuarios" element={<UserList />} />
                    <Route path="/usuarios/new" element={<UserForm />} />
                    <Route path="/usuarios/edit/:id" element={<UserForm />} />

                </Routes>
            </main>
        </div>
    );
}

// Envuelve el Layout con el Router principal
function AppWrapper() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default AppWrapper;
