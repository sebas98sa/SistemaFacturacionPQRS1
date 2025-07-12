package com.cedeunion.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ConfiguracionSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clave; // Ej: "politica_facturacion", "moneda_default" [cite: 99, 114, 125]
    private String valor; // Ej: "30_dias", "USD" [cite: 99, 114, 125]
    private String descripcion;
}