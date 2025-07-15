// frontend/src/components/MetodosPago/MetodoPagoList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MetodoPagoList() {
    const [metodosPago, setMetodosPago] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        fetch('/api/metodospago', {
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
                setMetodosPago(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener métodos de pago:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            try {
                const response = await fetch(`/api/metodospago/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setMetodosPago(metodosPago.filter(metodo => metodo.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
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
