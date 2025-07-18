// frontend/src/components/Configuracion/ConfiguracionSistemaForm.js
import React, { useState, useEffect } from 'react'; // LÍNEA CORREGIDA
import { useParams, useNavigate } from 'react-router-dom';

function ConfiguracionSistemaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [configuracion, setConfiguracion] = useState({
        clave: '', valor: '', descripcion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/configuracion/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error('Configuración no encontrada.');
                    return response.json();
                })
                .then(data => {
                    setConfiguracion(data);
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
        setConfiguracion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/configuracion/${id}` : '/api/configuracion';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configuracion),
            });

            if (response.ok) {
                navigate('/configuracion');
            } else {
                const errorText = await response.text();
                setError(errorText || 'Error al guardar la configuración.');
            }
        } catch (err) {
            setError('Error de red o del servidor al guardar la configuración.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <div>Cargando datos de configuración...</div>;
    }

    return (
        <div className="configuracion-form-container">
            <h2>{id ? 'Editar Configuración' : 'Agregar Configuración'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Clave:</label>
                    <input type="text" name="clave" value={configuracion.clave} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Valor:</label>
                    <input type="text" name="valor" value={configuracion.valor} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <input type="text" name="descripcion" value={configuracion.descripcion} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>Guardar Configuración</button>
                <button type="button" onClick={() => navigate('/configuracion')} disabled={loading}>Cancelar</button>
            </form>
        </div>
    );
}

export default ConfiguracionSistemaForm;
