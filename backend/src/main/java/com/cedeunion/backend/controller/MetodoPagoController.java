package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.MetodoPago;
import com.cedeunion.backend.service.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metodospago")
public class MetodoPagoController {

    @Autowired
    private MetodoPagoService metodoPagoService;

    // GET /api/metodospago - Obtener todos los métodos de pago
    @GetMapping
    public List<MetodoPago> getAllMetodosPago() {
        return metodoPagoService.getAllMetodosPago();
    }

    // GET /api/metodospago/{id} - Obtener un método de pago por ID
    @GetMapping("/{id}")
    public ResponseEntity<MetodoPago> getMetodoPagoById(@PathVariable Long id) {
        return metodoPagoService.getMetodoPagoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/metodospago - Crear un nuevo método de pago
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetodoPago createMetodoPago(@RequestBody MetodoPago metodoPago) {
        return metodoPagoService.createMetodoPago(metodoPago);
    }

    // PUT /api/metodospago/{id} - Actualizar un método de pago existente
    @PutMapping("/{id}")
    public ResponseEntity<MetodoPago> updateMetodoPago(@PathVariable Long id, @RequestBody MetodoPago metodoPagoDetails) {
        try {
            MetodoPago updatedMetodoPago = metodoPagoService.updateMetodoPago(id, metodoPagoDetails);
            return ResponseEntity.ok(updatedMetodoPago);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/metodospago/{id} - Eliminar un método de pago
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMetodoPago(@PathVariable Long id) {
        metodoPagoService.deleteMetodoPago(id);
    }

    // GET /api/metodospago/activos - Obtener solo los métodos de pago activos
    @GetMapping("/activos")
    public List<MetodoPago> getActiveMetodosPago() {
        return metodoPagoService.getActiveMetodosPago();
    }
}