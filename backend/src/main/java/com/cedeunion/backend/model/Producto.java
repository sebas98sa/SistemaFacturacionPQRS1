package com.cedeunion.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo; // Ej: "001", "002" [cite: 139]
    private String nombre; // Ej: "Producto 1", "Producto 2" [cite: 139]
    private double precio; // Ej: "$10", "$20" [cite: 139]
    private double impuesto; // Ej: "5%", "10%" [cite: 139]
    private int stock; // Ej: "100", "200" [cite: 139]
    private String categoria; // Ej: "Categoría 1", "Categoría 2" [cite: 139]
}