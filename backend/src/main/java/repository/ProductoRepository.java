package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.Producto; // <--- AÑADE ESTA SENTENCIA IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Puedes añadir métodos de consulta personalizados si los necesitas,
    // por ejemplo, para buscar un producto por su código
    Producto findByCodigo(String codigo);
}