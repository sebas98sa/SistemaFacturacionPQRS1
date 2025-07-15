// backend/src/main/java/com/cedeunion/backend/controller/AuthController.java
package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.Usuario;
import com.cedeunion.backend.security.JwtUtil; // Importar JwtUtil
import com.cedeunion.backend.service.CustomUserDetailsService; // Importar CustomUserDetailsService
import com.cedeunion.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // Importar AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Importar UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails; // Importar UserDetails
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

    @Autowired
    private AuthenticationManager authenticationManager; // Inyectar AuthenticationManager

    @Autowired
    private JwtUtil jwtUtil; // Inyectar JwtUtil

    @Autowired
    private CustomUserDetailsService userDetailsService; // Inyectar CustomUserDetailsService

    // DTO para la solicitud de inicio de sesión
    static class LoginRequest {
        public String email;
        public String password;
    }

    // POST /api/auth/login - Endpoint para el inicio de sesión
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar al usuario usando Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password)
            );
        } catch (Exception e) {
            // Si la autenticación falla, devolver 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        // Si la autenticación es exitosa, cargar los detalles del usuario y generar el JWT
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.email);
        final String jwt = jwtUtil.generateToken(userDetails); // Genera el token JWT

        // Devolver el token JWT en la respuesta
        Map<String, String> response = new HashMap<>();
        response.put("jwtToken", jwt); // El token JWT
        response.put("userEmail", userDetails.getUsername()); // Opcional: email del usuario
        response.put("userRole", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")); // Opcional: rol del usuario

        return ResponseEntity.ok(response);
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
            return ResponseEntity.ok("Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.");
        }
    }
}
