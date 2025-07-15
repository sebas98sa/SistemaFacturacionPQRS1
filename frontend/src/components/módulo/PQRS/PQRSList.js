// frontend/src/components/PQRS/PQRSList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PQRSList() {
    const [pqrsList, setPqrsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        fetch('/api/pqrs', {
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
                setPqrsList(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener PQRS:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar este PQRS?')) {
            try {
                const response = await fetch(`/api/pqrs/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setPqrsList(pqrsList.filter(pqrs => pqrs.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar PQRS: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar PQRS:", err);
                alert("No se pudo conectar con el servidor para eliminar el PQRS.");
            }
        }
    };

    if (loading) {
        return <div>Cargando PQRS...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="pqrs-list-container">
            <h2>Gestión de PQRS</h2>
            <Link to="/pqrs/new">
                <button>Nuevo PQRS</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Asunto</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {pqrsList.map(pqrs => (
                    <tr key={pqrs.id}>
                        <td>{pqrs.cliente ? pqrs.cliente.nombre : 'N/A'}</td>
                        <td>{pqrs.asunto}</td>
                        <td>{pqrs.estado}</td>
                        <td>{pqrs.prioridad}</td>
                        <td>{new Date(pqrs.fechaCreacion).toLocaleDateString()}</td>
                        <td>
                            <Link to={`/pqrs/edit/${pqrs.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(pqrs.id)}>Eliminar</button>
                            {/* Puedes añadir un Link para "Ver detalle" o "Seguimiento" si creas un componente para ello */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default PQRSList;
