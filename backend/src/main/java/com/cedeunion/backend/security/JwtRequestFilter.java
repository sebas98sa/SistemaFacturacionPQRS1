// backend/src/main/java/com/cedeunion/backend/security/JwtRequestFilter.java
package com.cedeunion.backend.security;

import com.cedeunion.backend.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component; // <-- Línea corregida
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        System.out.println("--- JwtRequestFilter: Procesando petición a " + request.getRequestURI() + " ---");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("JwtRequestFilter: Token JWT encontrado: " + jwt);
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("JwtRequestFilter: Username extraído: " + username);
            } catch (Exception e) {
                System.err.println("JwtRequestFilter: ERROR al extraer username o token inválido: " + e.getMessage());
                // Aquí puedes decidir qué hacer si el token es inválido (ej. enviar 401)
                // response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                // return;
            }
        } else {
            System.out.println("JwtRequestFilter: No se encontró cabecera Authorization o no empieza con Bearer.");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("JwtRequestFilter: Autenticando usuario: " + username);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                System.out.println("JwtRequestFilter: Token VALIDADO para usuario: " + username + ". Estableciendo autenticación.");
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                System.out.println("JwtRequestFilter: Token NO VÁLIDO para usuario: " + username);
            }
        } else if (username != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            System.out.println("JwtRequestFilter: Usuario ya autenticado en el contexto: " + username);
        } else {
            System.out.println("JwtRequestFilter: Username es nulo o no hay autenticación en el contexto.");
        }
        chain.doFilter(request, response);
        System.out.println("--- JwtRequestFilter: Petición a " + request.getRequestURI() + " PROCESADA ---");
    }
}
