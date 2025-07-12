package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.ConfiguracionSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionSistemaRepository extends JpaRepository<ConfiguracionSistema, Long> {
    // Para obtener una configuración específica por su clave
    Optional<ConfiguracionSistema> findByClave(String clave);
}