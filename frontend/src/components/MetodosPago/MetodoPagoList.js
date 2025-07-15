// frontend/src/components/MetodosPago/MetodoPagoList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MetodoPagoList() {
    const [metodosPago, setMetodosPago] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/metodospago')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMetodosPago(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener métodos de pago:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            try {
                const response = await fetch(`/api/metodospago/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setMetodosPago(metodosPago.filter(metodo => metodo.id !== id));
                } else {
                    const errorText = await response.text();
                    alert(`Error al eliminar método de pago: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar método de pago:", err);
                alert("No se pudo conectar con el servidor para eliminar el método de pago.");
            }
        }
    };

    if (loading) {
        return <div>Cargando métodos de pago...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="metodospago-list-container">
            <h2>Gestión de Métodos de Pago</h2>
            <Link to="/metodospago/new">
                <button>Agregar Método de Pago</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {metodosPago.map(metodo => (
                    <tr key={metodo.id}>
                        <td>{metodo.nombre}</td>
                        <td>{metodo.descripcion}</td>
                        <td>{metodo.activo ? 'Sí' : 'No'}</td>
                        <td>
                            <Link to={`/metodospago/edit/${metodo.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(metodo.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MetodoPagoList;
