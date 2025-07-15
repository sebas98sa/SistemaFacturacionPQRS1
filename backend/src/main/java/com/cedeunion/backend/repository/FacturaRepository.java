package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    // Métodos personalizados basados en los requisitos del sistema:
    List<Factura> findByEstado(String estado);
    List<Factura> findByClienteId(Long clienteId);
    List<Factura> findByFechaBetween(LocalDate startDate, LocalDate endDate);
}