package com.cedeunion.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
// import java.util.List; // Descomenta si añades una lista de productos/detalles a Factura

@Entity
@Data
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // Una factura pertenece a un cliente
    @JoinColumn(name = "cliente_id") // Columna de clave foránea
    private Cliente cliente; // Cliente asociado a la factura [cite: 156]

    private LocalDate fecha; // Fecha de la factura [cite: 157]

    private double total; // Monto total de la factura [cite: 158]

    private String estado; // Pendiente, Pagada, Vencida [cite: 38, 159]

    // Opcional: Relación con los ítems/productos de la factura.
    // Este ejemplo lo mantiene simple. Para el mundo real, podrías tener una entidad FacturaDetalle separada
    // @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<FacturaDetalle> detalles;
}