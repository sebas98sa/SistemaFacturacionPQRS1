package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.PQRS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PQRSRepository extends JpaRepository<PQRS, Long> {
    // Métodos personalizados para buscar PQRS por estado o prioridad
    List<PQRS> findByEstado(String estado);
    List<PQRS> findByPrioridad(String prioridad);
    List<PQRS> findByClienteId(Long clienteId); // Para ver PQRS de un cliente específico
}
