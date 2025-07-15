package com.cedeunion.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica la configuración CORS a todas las rutas de tu API.
                // Permitir un rango amplio de puertos localhost para desarrollo
                .allowedOrigins(
                        "http://localhost:3000", "http://127.0.0.1:3000",
                        "http://localhost:3001", "http://127.0.0.1:3001",
                        "http://localhost:3002", "http://127.0.0.1:3002",
                        "http://localhost:3003", "http://127.0.0.1:3003",
                        "http://localhost:3004", "http://127.0.0.1:3004", // Añadir más si es necesario
                        "http://localhost:3005", "http://127.0.0.1:3005"  // Añadir más si es necesario
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Asegúrate de incluir OPTIONS y HEAD
                .allowedHeaders("*") // Permite TODOS los encabezados, incluyendo Authorization
                .allowCredentials(true); // Permite el envío de credenciales (como cookies, encabezados de autorización)
    }
}

