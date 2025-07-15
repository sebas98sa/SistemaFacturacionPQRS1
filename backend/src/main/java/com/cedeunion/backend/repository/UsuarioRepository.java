package com.cedeunion.backend.repository;

import com.cedeunion.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // <--- AÑADE ESTA SENTENCIA IMPORT
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Para el inicio de sesión, necesitaremos buscar un usuario por su email
    Optional<Usuario> findByEmail(String email);

    // Para la gestión de usuarios y roles, podrías buscar por rol
    List<Usuario> findByRol(String rol);
}