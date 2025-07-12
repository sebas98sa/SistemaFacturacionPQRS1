package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.ConfiguracionSistema;
import com.cedeunion.backend.service.ConfiguracionSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionSistemaController {

    @Autowired
    private ConfiguracionSistemaService configuracionSistemaService;

    // GET /api/configuracion - Obtener todas las configuraciones
    @GetMapping
    public List<ConfiguracionSistema> getAllConfiguraciones() {
        return configuracionSistemaService.getAllConfiguraciones();
    }

    // GET /api/configuracion/{id} - Obtener una configuración por ID
    @GetMapping("/{id}")
    public ResponseEntity<ConfiguracionSistema> getConfiguracionById(@PathVariable Long id) {
        return configuracionSistemaService.getConfiguracionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/configuracion/clave/{clave} - Obtener una configuración por clave
    @GetMapping("/clave/{clave}")
    public ResponseEntity<ConfiguracionSistema> getConfiguracionByClave(@PathVariable String clave) {
        return configuracionSistemaService.getConfiguracionByClave(clave)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/configuracion - Crear una nueva configuración
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConfiguracionSistema createConfiguracion(@RequestBody ConfiguracionSistema configuracion) {
        return configuracionSistemaService.createConfiguracion(configuracion);
    }

    // PUT /api/configuracion/{id} - Actualizar una configuración existente
    @PutMapping("/{id}")
    public ResponseEntity<ConfiguracionSistema> updateConfiguracion(@PathVariable Long id, @RequestBody ConfiguracionSistema configuracionDetails) {
        try {
            ConfiguracionSistema updatedConfiguracion = configuracionSistemaService.updateConfiguracion(id, configuracionDetails);
            return ResponseEntity.ok(updatedConfiguracion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/configuracion/{id} - Eliminar una configuración
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteConfiguracion(@PathVariable Long id) {
        configuracionSistemaService.deleteConfiguracion(id);
    }
}