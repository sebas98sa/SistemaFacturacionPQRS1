// frontend/src/components/Usuarios/UserForm.js
import React, { useState, useEffect } from 'react'; // LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';

function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nombre: '', email: '', password: '', rol: 'USUARIO', enabled: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/usuarios/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('Usuario no encontrado.');
                    return response.json();
                })
                .then(data => {
                    // No cargar la contraseña real por seguridad
                    setUser({ ...data, password: '' });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/usuarios/${id}` : '/api/usuarios';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                navigate('/usuarios');
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el usuario.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos del usuario...</div>;
    }

    return (
        <div className="user-form-container">
            <h2>{id ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={user.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    {/* La contraseña solo es requerida al crear un nuevo usuario */}
                    <input type="password" name="password" value={user.password} onChange={handleChange} required={!id} />
                    {!id && <small>La contraseña es requerida para nuevos usuarios.</small>}
                    {id && <small>Deja en blanco para no cambiar la contraseña.</small>}
                </div>
                <div className="form-group">
                    <label>Rol:</label>
                    <select name="rol" value={user.rol} onChange={handleChange} required>
                        <option value="USUARIO">USUARIO</option>
                        <option value="EMPLEADO">EMPLEADO</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>
                        Habilitado:
                        <input type="checkbox" name="enabled" checked={user.enabled} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit" disabled={loading}>Guardar Usuario</button>
                <button type="button" onClick={() => navigate('/usuarios')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default UserForm;
