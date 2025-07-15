// frontend/src/components/Facturas/FacturaForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FacturaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState({
        cliente: null, // Objeto Cliente completo o solo su ID
        fecha: '', // Se llenará automáticamente en el backend o se seleccionará
        total: 0,
        estado: 'Pendiente'
    });
    const [clientes, setClientes] = useState([]); // Para la lista desplegable de clientes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        // Cargar lista de clientes para el selector
        fetch('/api/clientes', {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                }
                return response.json();
            })
            .then(data => setClientes(data))
            .catch(err => console.error("Error al cargar clientes:", err));

        if (id) { // Si estamos editando, cargar datos de la factura
            setLoading(true);
            fetch(`/api/facturas/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('Factura no encontrada.');
                    return response.json();
                })
                .then(data => {
                    setFactura({
                        ...data,
                        // Asegurarse de que el cliente sea un objeto con ID si es necesario para el selector
                        cliente: data.cliente ? data.cliente.id : '' // Usar '' para que el select no dé error si cliente es null
                    });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, navigate]); // Añadir navigate a las dependencias

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFactura(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        setFactura(prev => ({
            ...prev,
            // Envía solo el ID del cliente al backend, el backend lo buscará
            cliente: clienteId ? { id: parseInt(clienteId) } : null // Si no se selecciona nada, enviar null
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/facturas/${id}` : '/api/facturas';
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(factura),
            });

            if (response.ok) {
                navigate('/facturas');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); navigate('/'); alert('Sesión expirada o no autorizada.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar la factura.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar la factura.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos de la factura...</div>;
    }

    return (
        <div className="factura-form-container">
            <h2>{id ? 'Editar Factura' : 'Crear Factura'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Cliente:</label>
                    <select
                        name="cliente"
                        value={factura.cliente ? factura.cliente.id : ''}
                        onChange={handleClienteChange}
                        required
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map(cli => (
                            <option key={cli.id} value={cli.id}>{cli.nombre} ({cli.email})</option>
                        ))}
                    </select>
                </div>
                {/* La fecha se puede generar en el backend o si quieres que el usuario la seleccione: */}
                {/* <div className="form-group">
                    <label>Fecha:</label>
                    <input type="date" name="fecha" value={factura.fecha} onChange={handleChange} required />
                </div> */}
                <div className="form-group">
                    <label>Total:</label>
                    <input type="number" name="total" value={factura.total} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Estado:</label>
                    <select name="estado" value={factura.estado} onChange={handleChange} required>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagada">Pagada</option>
                        <option value="Vencida">Vencida</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>Guardar Factura</button>
                <button type="button" onClick={() => navigate('/facturas')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default FacturaForm;
