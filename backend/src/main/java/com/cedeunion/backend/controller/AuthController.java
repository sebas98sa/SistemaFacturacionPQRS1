// backend/src/main/java/com/cedeunion/backend/controller/AuthController.java
package com.cedeunion.backend.controller;

import com.cedeunion.backend.model.Usuario;
import com.cedeunion.backend.security.JwtUtil;
import com.cedeunion.backend.service.CustomUserDetailsService;
import com.cedeunion.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication; // Importar Authentication
import org.springframework.security.core.context.SecurityContextHolder; // Importar SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails;
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
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    static class LoginRequest {
        public String email;
        public String password;
    }

    // Endpoint para el inicio de sesión tradicional (email/password)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email, loginRequest.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.email);
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("jwtToken", jwt);
        response.put("userEmail", userDetails.getUsername());
        response.put("userRole", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));

        return ResponseEntity.ok(response);
    }

    // NUEVO: Endpoint para obtener JWT después de un inicio de sesión exitoso con Google
    @GetMapping("/google-login-success")
    public ResponseEntity<?> googleLoginSuccess() {
        // Obtener el objeto de autenticación del contexto de seguridad de Spring
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("jwtToken", jwt);
            response.put("userEmail", userDetails.getUsername());
            response.put("userRole", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));

            return ResponseEntity.ok(response);
        } else {
            // Si no hay autenticación o no es un UserDetails, algo salió mal o no se autenticó vía OAuth2
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se pudo obtener la autenticación de Google.");
        }
    }


    // Endpoint para la recuperación de contraseña
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
