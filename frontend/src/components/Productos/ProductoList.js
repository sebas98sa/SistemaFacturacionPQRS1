// frontend/src/components/Productos/ProductoList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/productos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProductos(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Gestión de Productos</h2>
            <Link to="/productos/new">
                <button>Agregar producto</button>
            </Link>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Precio</th>
                    <th>Impuesto</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {productos.map(producto => (
                    <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.codigo}</td>
                        <td>${producto.precio}</td>
                        <td>{producto.impuesto * 100}%</td>
                        <td>{producto.stock}</td>
                        <td>{producto.categoria}</td>
                        <td>
                            <button>Editar</button>
                            <button>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductoList;

