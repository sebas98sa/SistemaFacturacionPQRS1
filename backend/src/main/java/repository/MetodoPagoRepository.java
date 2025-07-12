package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {
    // Podrías añadir un método para obtener solo métodos de pago activos
    List<MetodoPago> findByActivoTrue();
}