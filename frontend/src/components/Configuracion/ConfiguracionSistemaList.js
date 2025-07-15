// frontend/src/components/Configuracion/ConfiguracionSistemaList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ConfiguracionSistemaList() {
    const [configuraciones, setConfiguraciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/configuracion')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setConfiguraciones(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener configuraciones:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta configuración?')) {
            try {
                const response = await fetch(`/api/configuracion/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setConfiguraciones(configuraciones.filter(config => config.id !== id));
                } else {
                    const errorText = await response.text();
                    alert(`Error al eliminar configuración: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar configuración:", err);
                alert("No se pudo conectar con el servidor para eliminar la configuración.");
            }
        }
    };

    if (loading) {
        return <div>Cargando configuraciones...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="configuracion-list-container">
            <h2>Configuración del Sistema</h2>
            <Link to="/configuracion/new">
                <button>Agregar Configuración</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Clave</th>
                    <th>Valor</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {configuraciones.map(config => (
                    <tr key={config.id}>
                        <td>{config.clave}</td>
                        <td>{config.valor}</td>
                        <td>{config.descripcion}</td>
                        <td>
                            <Link to={`/configuracion/edit/${config.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(config.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ConfiguracionSistemaList;
