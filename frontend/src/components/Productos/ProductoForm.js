// frontend/src/components/Productos/ProductoForm.js
// Este componente maneja la creación y edición de productos.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams para obtener el ID de la URL, useNavigate para la navegación

function ProductoForm() {
    // Obtiene el ID del producto de la URL si estamos en modo edición.
    // Si no hay ID, estamos en modo creación.
    const { id } = useParams();
    const navigate = useNavigate(); // Hook para la navegación programática

    // Estado para almacenar los datos del producto
    const [producto, setProducto] = useState({
        nombre: '',
        codigo: '',
        precio: 0,
        impuesto: 0, // Porcentaje de impuesto, por ejemplo, 0.05 para 5%
        stock: 0,
        categoria: ''
    });
    const [loading, setLoading] = useState(false); // Estado para indicar si hay una operación en curso
    const [error, setError] = useState(''); // Estado para almacenar mensajes de error

    // useEffect para cargar los datos del producto si estamos en modo edición
    useEffect(() => {
        if (id) { // Si existe un ID en la URL, significa que estamos editando un producto
            setLoading(true); // Activa el estado de carga
            // Realiza una solicitud GET al backend para obtener los detalles del producto por su ID
            fetch(`/api/productos/${id}`)
                .then(response => {
                    if (!response.ok) {
                        // Si la respuesta no es exitosa (ej. 404 Not Found), lanza un error
                        throw new Error('Producto no encontrado.');
                    }
                    return response.json(); // Parsea la respuesta JSON
                })
                .then(data => {
                    setProducto(data); // Actualiza el estado del producto con los datos obtenidos
                    setLoading(false); // Desactiva el estado de carga
                })
                .catch(err => {
                    setError(err.message); // Almacena el mensaje de error
                    setLoading(false); // Desactiva el estado de carga
                });
        }
    }, [id]); // Este efecto se ejecuta cada vez que el 'id' cambia

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProducto(prev => ({
            ...prev,
            // Convierte el valor a número si el tipo de input es 'number', de lo contrario, úsalo como string
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    // Maneja el envío del formulario (creación o actualización)
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)
        setError(''); // Limpia cualquier error previo
        setLoading(true); // Activa el estado de carga

        // Determina el método HTTP (POST para crear, PUT para actualizar)
        const method = id ? 'PUT' : 'POST';
        // Determina la URL del endpoint (con ID para actualizar, sin ID para crear)
        const url = id ? `/api/productos/${id}` : '/api/productos';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' }, // Indica que el cuerpo es JSON
                body: JSON.stringify(producto), // Convierte el objeto producto a una cadena JSON
            });

            if (response.ok) {
                // Si la respuesta es exitosa (2xx), redirige a la lista de productos
                navigate('/productos');
            } else {
                // Si la respuesta no es exitosa, obtiene el mensaje de error del backend
                const errorText = await response.text();
                setError(errorText || 'Error al guardar el producto.'); // Muestra el error
            }
        } catch (err) {
            // Captura errores de red o del servidor
            setError('Error de red o del servidor al guardar el producto.');
        } finally {
            setLoading(false); // Desactiva el estado de carga al finalizar la operación
        }
    };

    // Muestra un mensaje de carga si estamos obteniendo datos para edición
    if (loading && id) {
        return <div>Cargando datos del producto...</div>;
    }

    return (
        <div className="product-form-container">
            <h2>{id ? 'Editar Producto' : 'Agregar Producto'}</h2> {/* Título dinámico */}
            {error && <p className="error-message">{error}</p>} {/* Muestra mensajes de error */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Código:</label>
                    <input type="text" name="codigo" value={producto.codigo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Precio:</label>
                    <input type="number" name="precio" value={producto.precio} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Impuesto (%):</label>
                    <input type="number" name="impuesto" value={producto.impuesto} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Stock:</label>
                    <input type="number" name="stock" value={producto.stock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Categoría:</label>
                    <input type="text" name="categoria" value={producto.categoria} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={loading}>Guardar Producto</button> {/* Botón de envío, deshabilitado durante la carga */}
                <button type="button" onClick={() => navigate('/productos')} disabled={loading}>Cancelar</button> {/* Botón para cancelar y volver */}
            </form>
        </div>
    );
}

export default ProductoForm;