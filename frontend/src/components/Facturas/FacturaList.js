// frontend/src/components/Facturas/FacturaList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FacturaList() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/facturas')
            .then(response => {
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
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
            try {
                const response = await fetch(`/api/facturas/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setFacturas(facturas.filter(factura => factura.id !== id));
                } else {
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
        return <div>Cargando facturas...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="facturas-list-container">
            <h2>Gestión de Facturas</h2>
            <Link to="/facturas/new">
                <button>Nueva Factura</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {facturas.map(factura => (
                    <tr key={factura.id}>
                        <td>{factura.cliente ? factura.cliente.nombre : 'N/A'}</td>
                        <td>{factura.fecha}</td>
                        <td>${factura.total.toFixed(2)}</td>
                        <td>{factura.estado}</td>
                        <td>
                            <Link to={`/facturas/edit/${factura.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(factura.id)}>Eliminar</button>
                            {/* Puedes añadir un Link para "Ver detalle" si creas un componente para ello */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default FacturaList;