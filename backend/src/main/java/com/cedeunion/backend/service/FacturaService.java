package com.cedeunion.backend.service;

import com.cedeunion.backend.model.Factura;
import com.cedeunion.backend.repository.FacturaRepository;
import com.cedeunion.backend.model.Cliente; // Importa Cliente
import com.cedeunion.backend.repository.ClienteRepository; // Importa ClienteRepository

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private ClienteRepository clienteRepository; // Necesario para asociar la factura a un cliente

    public List<Factura> getAllFacturas() {
        return facturaRepository.findAll();
    }

    public Optional<Factura> getFacturaById(Long id) {
        return facturaRepository.findById(id);
    }

    public Factura createFactura(Factura factura) {
        // Asegúrate de que el cliente exista antes de crear la factura
        if (factura.getCliente() != null && factura.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(factura.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + factura.getCliente().getId()));
            factura.setCliente(cliente);
        } else {
            throw new IllegalArgumentException("La factura debe estar asociada a un cliente existente.");
        }
        factura.setFecha(LocalDate.now()); // Establece la fecha actual al crear la factura
        // Aquí podrías añadir lógica para calcular el total basado en los productos, etc.
        return facturaRepository.save(factura);
    }

    public Factura updateFactura(Long id, Factura facturaDetails) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con ID: " + id));

        // Actualiza el cliente si se proporciona uno nuevo y válido
        if (facturaDetails.getCliente() != null && facturaDetails.getCliente().getId() != null) {
            Cliente newCliente = clienteRepository.findById(facturaDetails.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Nuevo cliente no encontrado con ID: " + facturaDetails.getCliente().getId()));
            factura.setCliente(newCliente);
        }

        factura.setFecha(facturaDetails.getFecha());
        factura.setTotal(facturaDetails.getTotal());
        factura.setEstado(facturaDetails.getEstado());

        return facturaRepository.save(factura);
    }

    public void deleteFactura(Long id) {
        facturaRepository.deleteById(id);
    }

    public List<Factura> getFacturasByEstado(String estado) {
        return facturaRepository.findByEstado(estado);
    }
}