package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Opcional: añade métodos de consulta personalizados si es necesario, por ejemplo, para buscar clientes por email o teléfono.
    // Optional<Cliente> findByEmail(String email);
}


