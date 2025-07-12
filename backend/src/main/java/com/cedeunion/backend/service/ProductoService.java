package com.cedeunion.backend.service;

import com.cedeunion.backend.model.Producto; // <--- AÑADE ESTA SENTENCIA IMPORT
import com.cedeunion.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto createProducto(Producto producto) {
        // Aquí podrías añadir lógica de negocio antes de guardar, por ejemplo, validaciones
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto productoDetails) {
        // Busca el producto existente o lanza una excepción si no lo encuentra
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // Actualiza los campos del producto existente con los detalles proporcionados
        producto.setCodigo(productoDetails.getCodigo());
        producto.setNombre(productoDetails.getNombre());
        producto.setPrecio(productoDetails.getPrecio());
        producto.setImpuesto(productoDetails.getImpuesto());
        producto.setStock(productoDetails.getStock());
        producto.setCategoria(productoDetails.getCategoria());

        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto getProductoByCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo);
    }
}