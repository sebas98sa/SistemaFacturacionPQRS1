package com.cedeunion.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
// import java.util.List; // Descomenta si añades una lista de seguimientos

@Entity
@Data
public class PQRS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente; // Cliente que presenta el PQRS [cite: 134]

    private String asunto; // Asunto del PQRS [cite: 134]
    private String descripcion; // Descripción del PQRS [cite: 134]
    private String estado; // Abierto, En Proceso, Resuelto, Cerrado [cite: 53, 134]
    private String prioridad; // Alta, Media, Baja [cite: 53, 134]

    private LocalDateTime fechaCreacion; // Fecha/hora de creación
    private LocalDateTime ultimaActualizacion; // Fecha/hora de última actualización

    // Opcional: Relación con los seguimientos/comentarios para el módulo "Seguimiento de PQRS"
    // @OneToMany(mappedBy = "pqrs", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<SeguimientoPQRS> seguimientos;
}