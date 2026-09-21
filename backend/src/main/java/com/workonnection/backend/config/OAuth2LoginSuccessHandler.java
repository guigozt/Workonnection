package com.workonnection.backend.config;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UsuarioRepository usuarioRepository;
    private final SecurityContextRepository securityContextRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(
            UsuarioRepository usuarioRepository, 
            SecurityContextRepository securityContextRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.securityContextRepository = securityContextRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, 
            HttpServletResponse response, 
            Authentication authentication
    ) throws IOException, ServletException {
        
        // Persiste explicitamente o contexto de segurança no repositório de sessão
        SecurityContext context = SecurityContextHolder.getContext();
        securityContextRepository.saveContext(context, request, response);

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        String baseUrl = (frontendUrl != null && frontendUrl.endsWith("/")) 
                ? frontendUrl.substring(0, frontendUrl.length() - 1) 
                : frontendUrl;
        
        if (usuario != null) {
            request.getSession().setAttribute("usuarioId", usuario.getId());
        }
        
        // Verifica se o cadastro essencial já foi finalizado
        if (usuario != null && usuario.getCpf() != null && !usuario.getCpf().isEmpty()) {
            response.sendRedirect(baseUrl + "/home");
        } else {
            response.sendRedirect(baseUrl + "/auth/google/verify");
        }
    }
}