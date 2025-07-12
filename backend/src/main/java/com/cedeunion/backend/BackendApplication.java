package com.cedeunion.backend;

import com.cedeunion.backend.model.Usuario;
import com.cedeunion.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication // Marca esta clase como la clase de configuración principal de una aplicación Spring Boot.
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args); // Ejecuta la aplicación Spring Boot.
    }

    // Este Bean se ejecutará una vez que la aplicación Spring Boot haya iniciado.
    // Es útil para inicializar datos en la base de datos para propósitos de desarrollo y prueba.
    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verifica si el usuario 'admin@cedeunion.com' ya existe en la base de datos.
            if (usuarioRepository.findByEmail("admin@cedeunion.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Admin CEDEUNION");
                admin.setEmail("admin@cedeunion.com");
                // Codifica la contraseña antes de guardarla. ¡Nunca guardes contraseñas en texto plano!
                admin.setPassword(passwordEncoder.encode("adminpass"));
                admin.setRol("ADMIN"); // Asigna el rol de ADMINISTRADOR.
                admin.setEnabled(true); // Habilita la cuenta.
                usuarioRepository.save(admin); // Guarda el usuario en la base de datos.
                System.out.println("✅ Usuario 'admin@cedeunion.com' creado con rol ADMIN y contraseña 'adminpass'");
            }

            // Verifica si el usuario 'user@cedeunion.com' ya existe en la base de datos.
            if (usuarioRepository.findByEmail("user@cedeunion.com").isEmpty()) {
                Usuario user = new Usuario();
                user.setNombre("Usuario Demo");
                user.setEmail("user@cedeunion.com");
                // Codifica la contraseña.
                user.setPassword(passwordEncoder.encode("userpass"));
                user.setRol("USUARIO"); // Asigna el rol de USUARIO.
                user.setEnabled(true); // Habilita la cuenta.
                usuarioRepository.save(user); // Guarda el usuario en la base de datos.
                System.out.println("✅ Usuario 'user@cedeunion.com' creado con rol USUARIO y contraseña 'userpass'");
            }
        };
    }
}