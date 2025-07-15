// frontend/src/components/Clientes/ClienteForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ClienteForm() {
    const { id } = useParams(); // Obtiene el ID del cliente si estamos editando
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nombre: '', email: '', direccion: '', telefono: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) { // Si hay un ID, estamos editando
            setLoading(true);
            fetch(`/api/clientes/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('Cliente no encontrado.');
                    return response.json();
                })
                .then(data => {
                    setCliente(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/clientes/${id}` : '/api/clientes';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente),
            });

            if (response.ok) {
                navigate('/clientes'); // Redirige a la lista de clientes
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el cliente.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el cliente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos del cliente...</div>;
    }

    return (
        <div className="cliente-form-container">
            <h2>{id ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={cliente.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Teléfono:</label>
                    <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>Guardar Cliente</button>
                <button type="button" onClick={() => navigate('/clientes')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default ClienteForm;