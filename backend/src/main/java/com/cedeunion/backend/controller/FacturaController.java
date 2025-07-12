package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.Factura;
import com.cedeunion.backend.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    // GET /api/facturas - Obtener todas las facturas
    @GetMapping
    public List<Factura> getAllFacturas() {
        return facturaService.getAllFacturas();
    }

    // GET /api/facturas/{id} - Obtener una factura por ID
    @GetMapping("/{id}")
    public ResponseEntity<Factura> getFacturaById(@PathVariable Long id) {
        return facturaService.getFacturaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/facturas - Crear una nueva factura
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Factura> createFactura(@RequestBody Factura factura) {
        try {
            Factura newFactura = facturaService.createFactura(factura);
            return ResponseEntity.status(HttpStatus.CREATED).body(newFactura);
        } catch (RuntimeException e) {
            // CORREGIDO: Se devuelve ResponseEntity.badRequest().build() para mantener la consistencia del tipo de retorno
            // y evitar el error de tipos incompatibles.
            System.err.println("Error al crear factura: " + e.getMessage()); // Registra el error
            return ResponseEntity.badRequest().build(); // Devuelve 400 Bad Request sin un cuerpo específico
        }
    }

    // PUT /api/facturas/{id} - Actualizar una factura existente
    @PutMapping("/{id}")
    public ResponseEntity<Factura> updateFactura(@PathVariable Long id, @RequestBody Factura facturaDetails) {
        try {
            Factura updatedFactura = facturaService.updateFactura(id, facturaDetails);
            return ResponseEntity.ok(updatedFactura);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/facturas/{id} - Eliminar una factura
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFactura(@PathVariable Long id) {
        facturaService.deleteFactura(id);
    }

    // GET /api/facturas/estado/{estado} - Obtener facturas por estado
    @GetMapping("/estado/{estado}")
    public List<Factura> getFacturasByEstado(@PathVariable String estado) {
        return facturaService.getFacturasByEstado(estado);
    }
}