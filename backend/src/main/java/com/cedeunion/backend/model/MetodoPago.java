package com.cedeunion.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Ej: "Tarjeta de Crédito", "Transferencia Bancaria", "Efectivo"
    private String descripcion;
    private boolean activo; // Para habilitar/deshabilitar métodos de pago
}