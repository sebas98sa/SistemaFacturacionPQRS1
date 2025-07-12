package com.cedeunion.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity // Indica que esta clase es una entidad JPA y se mapeará a una tabla de BD
@Data   // Anotación de Lombok: Genera getters, setters, toString, equals y hashCode
public class Cliente {
    @Id // Marca 'id' como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estrategia para autoincrementar el ID
    private Long id; // Identificador único del cliente

    private String nombre;
    private String email;
    private String direccion;
    private String telefono;
    // Añade otros campos como NIT/Cédula, etc., según sea necesario.
}