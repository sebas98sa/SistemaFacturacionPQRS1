package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.Producto; // <--- ADD THIS IMPORT STATEMENT
import com.cedeunion.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // GET /api/productos - Obtener todos los productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // GET /api/productos/{id} - Obtener un producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/productos - Crear un nuevo producto
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.createProducto(producto);
    }

    // PUT /api/productos/{id} - Actualizar un producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        try {
            Producto updatedProducto = productoService.updateProducto(id, productoDetails);
            return ResponseEntity.ok(updatedProducto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/productos/{id} - Eliminar un producto
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
    }

    // GET /api/productos/codigo/{codigo} - Obtener un producto por código
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Producto> getProductoByCodigo(@PathVariable String codigo) {
        Producto producto = productoService.getProductoByCodigo(codigo);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}