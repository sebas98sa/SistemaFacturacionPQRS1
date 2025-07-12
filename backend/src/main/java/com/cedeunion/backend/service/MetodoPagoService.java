package com.cedeunion.backend.service;

import com.cedeunion.backend.model.MetodoPago;
import com.cedeunion.backend.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    public List<MetodoPago> getAllMetodosPago() {
        return metodoPagoRepository.findAll();
    }

    public Optional<MetodoPago> getMetodoPagoById(Long id) {
        return metodoPagoRepository.findById(id);
    }

    public MetodoPago createMetodoPago(MetodoPago metodoPago) {
        return metodoPagoRepository.save(metodoPago);
    }

    public MetodoPago updateMetodoPago(Long id, MetodoPago metodoPagoDetails) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado con ID: " + id));

        metodoPago.setNombre(metodoPagoDetails.getNombre());
        metodoPago.setDescripcion(metodoPagoDetails.getDescripcion());
        metodoPago.setActivo(metodoPagoDetails.isActivo());

        return metodoPagoRepository.save(metodoPago);
    }

    public void deleteMetodoPago(Long id) {
        metodoPagoRepository.deleteById(id);
    }

    public List<MetodoPago> getActiveMetodosPago() {
        return metodoPagoRepository.findByActivoTrue();
    }
}