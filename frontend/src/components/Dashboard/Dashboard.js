// frontend/src/components/Dashboard/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Para la navegación entre módulos
import Sidebar from './Sidebar'; // Lo crearemos a continuación
import Header from '../Shared/Header'; // Lo crearemos a continuación

function Dashboard() {
    // Simular datos para gráficos y notificaciones (reemplazar con llamadas a la API)
    const totalFacturado = "$50,000"; // [cite: 81]
    const pagosPendientes = "$10,000"; // [cite: 82]
    const ticketsAbiertos = 5; // [cite: 84]
    const ticketsEnProceso = 3; // [cite: 85]
    const notificaciones = [ // [cite: 107]
        "Factura #2023-001 ha sido pagada.", // [cite: 108]
        "Nuevo PQRS: Queja de Juan Pérez.", // [cite: 109]
        "Recordatorio: Pago pendiente de Cliente A.", // [cite: 110]
    ];

    return (
        <div className="dashboard-layout">
            {/* Puedes crear un componente Header para el logo y nombre de la empresa [cite: 76] */}
            <Header title="CEDEUNION" /> {/* [cite: 76] */}
            <Sidebar /> {/* Sidebar con enlaces de navegación [cite: 78, 79, 80, 87, 90, 91, 92] */}

            <main className="dashboard-content">
                <h1>Dashboard</h1> {/* [cite: 77] */}

                <div className="summary-cards">
                    <div className="card">
                        <h3>Total Facturado</h3>
                        <p>{totalFacturado}</p> {/* [cite: 81] */}
                    </div>
                    <div className="card">
                        <h3>Pagos Pendientes</h3>
                        <p>{pagosPendientes}</p> {/* [cite: 82] */}
                    </div>
                    <div className="card">
                        <h3>Tickets Abiertos</h3>
                        <p>{ticketsAbiertos}</p> {/* [cite: 84] */}
                    </div>
                    <div className="card">
                        <h3>Tickets en Proceso</h3>
                        <p>{ticketsEnProceso}</p> {/* [cite: 85] */}
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="section charts">
                        <h3>Gráficos de Ventas</h3> {/* [cite: 86, 88] */}
                        {/* Aquí iría un componente de gráfico real */}
                        <div className="chart-placeholder">
                            {/* Simular gráficos de ventas [cite: 89, 93, 94] */}
                            <p>Gráfico de Ventas Mostrando Tendencias (20%, 50%, 10%)</p>
                        </div>
                    </div>

                    <div className="section notifications">
                        <h3>Notificaciones Recientes</h3> {/* [cite: 107] */}
                        <ul>
                            {notificaciones.map((notif, index) => (
                                <li key={index}>{notif}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Acceso Rápido a Módulos (similar al Sidebar, pero puedes tener aquí iconos grandes) */}
                <div className="quick-access">
                    <h3>Acceso Rápido</h3>
                    <Link to="/clientes">Gestión de Clientes</Link> {/* [cite: 27, 78, 100] */}
                    <Link to="/facturas">Gestión de Facturas</Link> {/* [cite: 28, 79, 101] */}
                    <Link to="/productos">Gestión de Productos</Link> {/* [cite: 29, 87, 102] */}
                    <Link to="/pqrs">PQRS</Link> {/* [cite: 30, 90, 104] */}
                    <Link to="/metodospago">Métodos de Pago</Link> {/* [cite: 90, 103] */}
                    <Link to="/configuracion">Configuración de Sistema</Link> {/* [cite: 31, 91, 105] */}
                    <Link to="/usuarios">Gestión de Usuarios y Roles</Link> {/* [cite: 92, 106] */}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;