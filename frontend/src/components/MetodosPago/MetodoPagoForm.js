// frontend/src/components/MetodosPago/MetodoPagoForm.js
import React, { useState, useEffect } from 'react'; // LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';

function MetodoPagoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [metodoPago, setMetodoPago] = useState({
        nombre: '', descripcion: '', activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/metodospago/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('Método de pago no encontrado.');
                    return response.json();
                })
                .then(data => {
                    setMetodoPago(data);
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
        setMetodoPago(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/metodospago/${id}` : '/api/metodospago';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metodoPago),
            });

            if (response.ok) {
                navigate('/metodospago');
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el método de pago.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar el método de pago.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos del método de pago...</div>;
    }

    return (
        <div className="metodopago-form-container">
            <h2>{id ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={metodoPago.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <input type="text" name="descripcion" value={metodoPago.descripcion} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>
                        Activo:
                        <input type="checkbox" name="activo" checked={metodoPago.activo} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit" disabled={loading}>Guardar Método de Pago</button>
                <button type="button" onClick={() => navigate('/metodospago')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default MetodoPagoForm;
