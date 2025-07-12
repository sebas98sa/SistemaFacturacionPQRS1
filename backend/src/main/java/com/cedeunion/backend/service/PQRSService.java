package com.cedeunion.backend.service;

import com.cedeunion.backend.model.PQRS;
import com.cedeunion.backend.model.Cliente;
import com.cedeunion.backend.repository.PQRSRepository;
import com.cedeunion.backend.repository.ClienteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PQRSService {

    @Autowired
    private PQRSRepository pqrsRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public List<PQRS> getAllPQRS() {
        return pqrsRepository.findAll();
    }

    public Optional<PQRS> getPQRSById(Long id) {
        return pqrsRepository.findById(id);
    }

    public PQRS createPQRS(PQRS pqrs) {
        if (pqrs.getCliente() != null && pqrs.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(pqrs.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + pqrs.getCliente().getId()));
            pqrs.setCliente(cliente);
        } else {
            throw new IllegalArgumentException("El PQRS debe estar asociado a un cliente existente.");
        }
        pqrs.setFechaCreacion(LocalDateTime.now());
        pqrs.setUltimaActualizacion(LocalDateTime.now());
        if (pqrs.getEstado() == null || pqrs.getEstado().isEmpty()) {
            pqrs.setEstado("Abierto");
        }
        if (pqrs.getPrioridad() == null || pqrs.getPrioridad().isEmpty()) {
            pqrs.setPrioridad("Media");
        }
        return pqrsRepository.save(pqrs);
    }

    public PQRS updatePQRS(Long id, PQRS pqrsDetails) {
        PQRS pqrs = pqrsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PQRS no encontrado con ID: " + id));

        if (pqrsDetails.getCliente() != null && pqrsDetails.getCliente().getId() != null) {
            Cliente newCliente = clienteRepository.findById(pqrsDetails.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Nuevo cliente para PQRS no encontrado con ID: " + pqrsDetails.getCliente().getId()));
            pqrs.setCliente(newCliente);
        }

        pqrs.setAsunto(pqrsDetails.getAsunto());
        pqrs.setDescripcion(pqrsDetails.getDescripcion());
        pqrs.setEstado(pqrsDetails.getEstado());
        pqrs.setPrioridad(pqrsDetails.getPrioridad());
        pqrs.setUltimaActualizacion(LocalDateTime.now());

        return pqrsRepository.save(pqrs);
    }

    public void deletePQRS(Long id) {
        pqrsRepository.deleteById(id);
    }

    public List<PQRS> getPQRSByEstado(String estado) {
        return pqrsRepository.findByEstado(estado);
    }

    // ENSURE THIS METHOD IS PRESENT AND CORRECTLY SPELLED
    public List<PQRS> getPQRSByPrioridad(String prioridad) {
        return pqrsRepository.findByPrioridad(prioridad);
    }
}