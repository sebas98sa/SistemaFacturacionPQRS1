package com.cedeunion.backend.service;

import com.cedeunion.backend.model.ConfiguracionSistema;
import com.cedeunion.backend.repository.ConfiguracionSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracionSistemaService {

    @Autowired
    private ConfiguracionSistemaRepository configuracionSistemaRepository;

    public List<ConfiguracionSistema> getAllConfiguraciones() {
        return configuracionSistemaRepository.findAll();
    }

    public Optional<ConfiguracionSistema> getConfiguracionById(Long id) {
        return configuracionSistemaRepository.findById(id);
    }

    public Optional<ConfiguracionSistema> getConfiguracionByClave(String clave) {
        return configuracionSistemaRepository.findByClave(clave);
    }

    public ConfiguracionSistema createConfiguracion(ConfiguracionSistema configuracion) {
        // Podrías añadir validación para asegurar que 'clave' sea única
        return configuracionSistemaRepository.save(configuracion);
    }

    public ConfiguracionSistema updateConfiguracion(Long id, ConfiguracionSistema configuracionDetails) {
        ConfiguracionSistema configuracion = configuracionSistemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuración no encontrada con ID: " + id));

        configuracion.setClave(configuracionDetails.getClave());
        configuracion.setValor(configuracionDetails.getValor());
        configuracion.setDescripcion(configuracionDetails.getDescripcion());

        return configuracionSistemaRepository.save(configuracion);
    }

    public void deleteConfiguracion(Long id) {
        configuracionSistemaRepository.deleteById(id);
    }
}