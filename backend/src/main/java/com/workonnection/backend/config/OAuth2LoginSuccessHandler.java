package com.workonnection.backend.config;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UsuarioRepository usuarioRepository;

    public OAuth2LoginSuccessHandler(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        String frontendUrl = "http://localhost:5173"; // TODO: read from config
        
        if (usuario != null && usuario.getNome() != null && !usuario.getNome().isEmpty()) {
            // User is fully registered
            response.sendRedirect(frontendUrl + "/home");
        } else {
            // User needs to complete registration
            response.sendRedirect(frontendUrl + "/auth/google/verify");
        }
    }
}
