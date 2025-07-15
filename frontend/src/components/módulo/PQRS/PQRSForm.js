// frontend/src/components/PQRS/PQRSForm.js
import React, { useState, useEffect } from 'react'; // <-- LÍNEA CORREGIDA: 'from' en lugar de '=>'
import { useParams, useNavigate } from 'react-router-dom';

function PQRSForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pqrs, setPqrs] = useState({
        cliente: null, // Objeto Cliente o solo su ID
        asunto: '',
        descripcion: '',
        estado: 'Abierto', // Estado inicial por defecto
        prioridad: 'Media' // Prioridad inicial por defecto
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

        if (id) { // Si estamos editando, cargar datos del PQRS
            setLoading(true);
            fetch(`/api/pqrs/${id}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(response => {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('jwtToken'); navigate('/'); throw new Error('Sesión expirada.');
                    }
                    if (!response.ok) throw new Error('PQRS no encontrado.');
                    return response.json();
                })
                .then(data => {
                    setPqrs({
                        ...data,
                        cliente: data.cliente ? data.cliente.id : ''
                    });
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPqrs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        setPqrs(prev => ({
            ...prev,
            cliente: clienteId ? { id: parseInt(clienteId) } : null
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/pqrs/${id}` : '/api/pqrs';
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
                body: JSON.stringify(pqrs),
            });

            if (response.ok) {
                navigate('/pqrs'); // Redirige a la lista de PQRS
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail');
                navigate('/');
                alert('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.');
            }
            else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el PQRS.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el PQRS.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos del PQRS...</div>;
    }

    return (
        <div className="pqrs-form-container">
            <h2>{id ? 'Editar PQRS' : 'Crear Nuevo PQRS'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Cliente:</label>
                    <select
                        name="cliente"
                        value={pqrs.cliente ? pqrs.cliente.id : ''}
                        onChange={handleClienteChange}
                        required
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map(cli => (
                            <option key={cli.id} value={cli.id}>{cli.nombre} ({cli.email})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Asunto:</label>
                    <input type="text" name="asunto" value={pqrs.asunto} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea name="descripcion" value={pqrs.descripcion} onChange={handleChange} required rows="4"></textarea>
                </div>
                <div className="form-group">
                    <label>Estado:</label>
                    <select name="estado" value={pqrs.estado} onChange={handleChange} required>
                        <option value="Abierto">Abierto</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Prioridad:</label>
                    <select name="prioridad" value={pqrs.prioridad} onChange={handleChange} required>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>Guardar PQRS</button>
                <button type="button" onClick={() => navigate('/pqrs')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default PQRSForm;
