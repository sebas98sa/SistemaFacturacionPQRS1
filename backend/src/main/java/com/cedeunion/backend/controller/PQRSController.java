package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.PQRS;
import com.cedeunion.backend.service.PQRSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pqrs")
public class PQRSController {

    @Autowired
    private PQRSService pqrsService;

    // GET /api/pqrs - Obtener todas las PQRS
    @GetMapping
    public List<PQRS> getAllPQRS() {
        return pqrsService.getAllPQRS();
    }

    // GET /api/pqrs/{id} - Obtener una PQRS por ID
    @GetMapping("/{id}")
    public ResponseEntity<PQRS> getPQRSById(@PathVariable Long id) {
        return pqrsService.getPQRSById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/pqrs - Crear una nueva PQRS
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PQRS> createPQRS(@RequestBody PQRS pqrs) {
        try {
            PQRS newPqrs = pqrsService.createPQRS(pqrs);
            return ResponseEntity.status(HttpStatus.CREATED).body(newPqrs);
        } catch (RuntimeException e) { // CORREGIDO: Captura solo RuntimeException
            // Manejo de errores si el cliente no se encuentra o hay otros problemas
            System.err.println("Error al crear PQRS: " + e.getMessage()); // Registra el error
            // Se devuelve 400 Bad Request sin un cuerpo específico para mantener la consistencia del tipo de retorno
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT /api/pqrs/{id} - Actualizar una PQRS existente
    @PutMapping("/{id}")
    public ResponseEntity<PQRS> updatePQRS(@PathVariable Long id, @RequestBody PQRS pqrsDetails) {
        try {
            PQRS updatedPqrs = pqrsService.updatePQRS(id, pqrsDetails);
            return ResponseEntity.ok(updatedPqrs);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/pqrs/{id} - Eliminar una PQRS
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePQRS(@PathVariable Long id) {
        pqrsService.deletePQRS(id);
    }

    // GET /api/pqrs/estado/{estado} - Obtener PQRS por estado
    @GetMapping("/estado/{estado}")
    public List<PQRS> getPQRSByEstado(@PathVariable String estado) {
        return pqrsService.getPQRSByEstado(estado);
    }

    // GET /api/pqrs/prioridad/{prioridad} - Obtener PQRS por prioridad
    @GetMapping("/prioridad/{prioridad}")
    public List<PQRS> getPQRSByPrioridad(@PathVariable String prioridad) {
        // CORREGIDO: Se cambió 'findByPrioridad' a 'getPQRSByPrioridad' para coincidir con el servicio
        return pqrsService.getPQRSByPrioridad(prioridad);
    }
}