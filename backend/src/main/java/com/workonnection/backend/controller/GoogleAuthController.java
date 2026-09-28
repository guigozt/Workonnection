package com.workonnection.backend.controller;

import com.workonnection.backend.dto.GoogleTokenDTO;
import com.workonnection.backend.dto.UsuarioResponseDTO;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.service.GoogleOAuthService;
import com.workonnection.backend.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    private final GoogleOAuthService googleOAuthService;
    private final UsuarioService usuarioService;
    private final SecurityContextRepository securityContextRepository;

    @org.springframework.beans.factory.annotation.Value("${spring.security.oauth2.client.registration.google.client-id:${GOOGLE_CLIENT_ID:}}")
    private String googleClientId;

    public GoogleAuthController(
            GoogleOAuthService googleOAuthService,
            UsuarioService usuarioService,
            SecurityContextRepository securityContextRepository
    ) {
        this.googleOAuthService = googleOAuthService;
        this.usuarioService = usuarioService;
        this.securityContextRepository = securityContextRepository;
    }

    @GetMapping("/client-id")
    public ResponseEntity<java.util.Map<String, String>> getClientId() {
        return ResponseEntity.ok(java.util.Map.of("clientId", googleClientId != null ? googleClientId : ""));
    }

    // ALTERAÇÃO AQUI: Mudou de ResponseEntity<UsuarioResponseDTO> para ResponseEntity<?>
    @PostMapping
    public ResponseEntity<?> autenticarComToken(
            @RequestBody GoogleTokenDTO dto,
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session
    ) {
        try {
            Usuario usuario = googleOAuthService.verifyAndProcessToken(dto.token());

            if (session != null) {
                session.setAttribute("usuarioId", usuario.getId());
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            usuario.getEmail(),
                            null,
                            Collections.emptyList()
                    );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            if (securityContextRepository != null) {
                securityContextRepository.saveContext(context, request, response);
            }

            UsuarioResponseDTO usuarioResponse = usuarioService.buscarPorId(usuario.getId());
            return ResponseEntity.ok(usuarioResponse);
            
        } catch (Exception e) {
            System.err.println("❌ ERRO NO LOGIN DO GOOGLE: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                .body("Falha ao autenticar com Google: " + e.getMessage());
        }
    }
}