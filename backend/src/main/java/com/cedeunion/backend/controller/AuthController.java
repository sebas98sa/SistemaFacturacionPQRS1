package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.Usuario;
import com.cedeunion.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // DTO para la solicitud de inicio de sesión
    static class LoginRequest {
        public String email;
        public String password;
    }

    // POST /api/auth/login - Endpoint para el inicio de sesión
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioService.getUsuarioByEmail(loginRequest.email);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Compara la contraseña proporcionada con la contraseña codificada almacenada
            if (passwordEncoder.matches(loginRequest.password, usuario.getPassword()) && usuario.isEnabled()) {
                // Autenticación exitosa. En un sistema real, aquí se generaría un JWT.
                Map<String, String> response = new HashMap<>();
                response.put("message", "Inicio de sesión exitoso");
                response.put("userId", String.valueOf(usuario.getId()));
                response.put("userEmail", usuario.getEmail());
                response.put("userRole", usuario.getRol());
                return ResponseEntity.ok(response);
            }
        }
        // Credenciales inválidas o usuario no encontrado/deshabilitado
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    // POST /api/auth/recuperar-contrasena - Endpoint para la recuperación de contraseña
    @PostMapping("/recuperar-contrasena")
    public ResponseEntity<String> recuperarContrasena(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("El email es requerido para la recuperación de contraseña.");
        }
        boolean success = usuarioService.recuperarContrasena(email);
        if (success) {
            return ResponseEntity.ok("Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.");
        } else {
            // Se envía un mensaje genérico por seguridad, para no revelar si el correo existe o no
            return ResponseEntity.ok("Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.");
        }
    }
}