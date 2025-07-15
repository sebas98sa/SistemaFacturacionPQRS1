// frontend/src/components/Clientes/ClienteList.js (y similar para ProductoList, FacturaList, etc.)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir

function ClienteList() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken'); // Obtener el JWT
        if (!jwtToken) {
            // Si no hay token, redirigir al login
            navigate('/');
            return;
        }

        fetch('/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`, // <-- Envía el JWT aquí
            },
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    // Si el token es inválido o expiró, redirigir al login
                    localStorage.removeItem('jwtToken'); // Limpiar token inválido
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userEmail');
                    navigate('/');
                    throw new Error('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setClientes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener clientes:", error);
                setError(error);
                setLoading(false);
            });
    }, [navigate]); // Añadir navigate a las dependencias del useEffect

    const handleDelete = async (id) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            try {
                const response = await fetch(`/api/clientes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`, // <-- Incluir JWT aquí
                    },
                });

                if (response.ok) {
                    setClientes(clientes.filter(cliente => cliente.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar cliente: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar cliente:", err);
                alert("No se pudo conectar con el servidor para eliminar el cliente.");
            }
        }
    };

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="clientes-list-container">
            <h2>Gestión de Clientes</h2>
            <Link to="/clientes/new">
                <button>Agregar Cliente</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr key={cliente.id}>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.direccion}</td>
                        <td>
                            <Link to={`/clientes/edit/${cliente.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClienteList;
