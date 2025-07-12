package com.cedeunion.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email; // Utilizado para el inicio de sesión [cite: 18]

    @Column(nullable = false)
    private String password; // Contraseña (debe ser hasheada) [cite: 18]

    private String nombre;
    private String rol; // Ej: "ADMIN", "USUARIO", "EMPLEADO" [cite: 67]
    private boolean enabled = true; // Para habilitar/deshabilitar cuentas de usuario
}