// backend/src/main/java/com/cedeunion/backend/service/CustomOAuth2UserService.java
package com.cedeunion.backend.service;

import com.cedeunion.backend.model.Usuario;
import com.cedeunion.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User; // <-- NUEVO: Importar DefaultOAuth2User
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;
import java.util.Set; // <-- NUEVO: Importar Set
import java.util.stream.Collectors; // <-- NUEVO: Importar Collectors

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<Usuario> existingUser = usuarioRepository.findByEmail(email);
        Usuario user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Actualizar información del usuario si es necesario (ej. nombre)
            user.setNombre(name);
            usuarioRepository.save(user);
        } else {
            // Crear nuevo usuario si no existe
            user = new Usuario();
            user.setEmail(email);
            user.setNombre(name);
            user.setPassword(""); // Contraseña vacía o generada para usuarios OAuth2 (no se usa para login directo)
            user.setRol("USUARIO"); // Rol por defecto para nuevos usuarios de Google
            user.setEnabled(true);
            usuarioRepository.save(user);
        }

        // Obtener las autoridades (roles) del usuario
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(
                new SimpleGrantedAuthority("ROLE_" + user.getRol().toUpperCase())
        );

        // Devolver un DefaultOAuth2User, que es una implementación de OAuth2User
        // Necesita: authorities, atributos originales de OAuth2User, y el nombre del atributo de nombre
        return new DefaultOAuth2User(
                authorities,
                oauth2User.getAttributes(), // Mantener los atributos originales de Google
                "email" // El atributo que Google usa como "nombre" principal (email)
        );
    }
}

