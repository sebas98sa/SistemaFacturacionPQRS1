package com.cedeunion.backend.config;

import com.cedeunion.backend.security.JwtRequestFilter;
import com.cedeunion.backend.service.CustomUserDetailsService;
import com.cedeunion.backend.service.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Esta importación ya estaba y es correcta
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public AuthenticationManager authenticationManager(CustomUserDetailsService customUserDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(customUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(authorize -> authorize
                        // Rutas públicas (login, recuperación, consola H2, y rutas de redirección de OAuth2)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/recuperar-contrasena", "/h2-console/**").permitAll()
                        // Permitir acceso a las rutas de inicio de sesión de OAuth2
                        .requestMatchers("/oauth2/**", "/login/oauth2/code/**").permitAll()

                        // Rutas protegidas por rol
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers("/api/clientes/**", "/api/productos/**", "/api/facturas/**",
                                "/api/pqrs/**", "/api/metodospago/**", "/api/configuracion/**").hasAnyRole("ADMIN", "USUARIO", "EMPLEADO")

                        // Cualquier otra solicitud no especificada requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .logout(logout -> logout.disable())
                // Configuración para OAuth2 Login
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorize")
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService()) // Usar un servicio personalizado para procesar la información del usuario de Google
                        )
                        .successHandler(oauth2SuccessHandler())
                        .failureHandler((request, response, exception) -> {
                            System.err.println("OAuth2 Login Failed: " + exception.getMessage());
                            response.sendRedirect("http://localhost:3002/login?error=oauth2_failure");
                        })
                )
                // LÍNEA CORREGIDA: Usar UsernamePasswordAuthenticationFilter.class
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    // Bean para el servicio de usuario OAuth2 personalizado
    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }

    // Manejador de éxito para OAuth2 (para redirigir o generar JWT)
    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
            // Después de un login exitoso con Google, redirigimos a una URL del frontend.
            // El frontend deberá hacer una petición a /api/auth/google-login-success
            // para obtener el JWT de la sesión de Spring Security.
            response.sendRedirect("http://localhost:3002/oauth2/redirect");
        };
    }
}

