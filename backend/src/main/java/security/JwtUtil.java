// backend/src/main/java/com/cedeunion/backend/security/JwtUtil.java
package com.cedeunion.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys; // Importar Keys para generar la clave segura
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // Importar SecretKey
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Clave secreta para firmar los tokens. Se obtiene de application.properties.
    // Es crucial que esta clave sea fuerte y no se comparta.
    @Value("${jwt.secret}")
    private String secret;

    // Tiempo de validez del token en milisegundos (ej. 10 horas)
    @Value("${jwt.expiration}")
    private long expiration; // 10 horas en milisegundos

    // Genera una clave segura a partir del secreto.
    private SecretKey getSigningKey() {
        // Asegúrate de que la clave secreta sea lo suficientemente larga para HS256 (mínimo 256 bits o 32 bytes)
        // Si tu 'secret' es una cadena corta, puedes generar una clave segura a partir de ella.
        // Para desarrollo, puedes usar Keys.secretKeyFor(SignatureAlgorithm.HS256);
        // Para producción, deberías usar una clave generada de forma segura y almacenada externamente.
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Extrae el nombre de usuario (email) del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrae la fecha de expiración del token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrae un 'claim' específico del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extrae todos los 'claims' del token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Verifica si el token ha expirado
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Genera un token JWT para un usuario
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Añadir roles como un claim personalizado
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .collect(java.util.stream.Collectors.toList()));
        return createToken(claims, userDetails.getUsername());
    }

    // Crea el token JWT
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Valida el token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
