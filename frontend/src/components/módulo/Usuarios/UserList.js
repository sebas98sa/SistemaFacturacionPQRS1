// frontend/src/components/Usuarios/UserList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        // Esta API debería estar protegida y solo accesible por administradores
        fetch('/api/usuarios', {
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
                    throw new Error('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener usuarios:", error);
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

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`/api/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                });

                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                    navigate('/');
                    alert('Acceso denegado. Por favor, inicia sesión de nuevo con un usuario ADMIN.');
                }
                else {
                    const errorText = await response.text();
                    alert(`Error al eliminar usuario: ${errorText}`);
                }
            } catch (err) {
                console.error("Error de red al eliminar usuario:", err);
                alert("No se pudo conectar con el servidor para eliminar el usuario.");
            }
        }
    };

    if (loading) {
        return <div>Cargando usuarios...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="user-list-container">
            <h2>Gestión de Usuarios y Roles</h2>
            <Link to="/usuarios/new">
                <button>Agregar Usuario</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Habilitado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.nombre}</td>
                        <td>{user.email}</td>
                        <td>{user.rol}</td>
                        <td>{user.enabled ? 'Sí' : 'No'}</td>
                        <td>
                            <Link to={`/usuarios/edit/${user.id}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
