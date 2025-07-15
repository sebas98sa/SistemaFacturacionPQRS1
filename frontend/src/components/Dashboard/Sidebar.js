// frontend/src/components/Dashboard/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li> {/* [cite: 77, 98, 113, 124, 138] */}
                    <li><Link to="/clientes">Gestión de Clientes</Link></li> {/* [cite: 78, 100, 115, 126, 140] */}
                    <li><Link to="/facturas">Gestión de Facturas</Link></li> {/* [cite: 79, 101, 116, 127, 141] */}
                    <li><Link to="/productos">Gestión de Productos</Link></li> {/* [cite: 87, 102, 117, 128, 136, 142] */}
                    <li><Link to="/pqrs">PQRS</Link></li> {/* [cite: 90, 104, 119, 130, 133, 144] */}
                    <li><Link to="/metodospago">Métodos de Pago</Link></li> {/* [cite: 90, 103, 118, 129, 143] */}
                    <li><Link to="/configuracion">Configuración de Sistema</Link></li> {/* [cite: 91, 97, 105, 112, 120, 123, 131, 145] */}
                    <li><Link to="/usuarios">Gestión de Usuarios y Roles</Link></li> {/* [cite: 92, 106, 121, 132, 146] */}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;