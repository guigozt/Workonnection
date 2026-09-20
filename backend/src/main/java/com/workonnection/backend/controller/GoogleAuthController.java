package com.workonnection.backend.controller;

import com.workonnection.backend.dto.GoogleVerificationDTO;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.service.GoogleOAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    private final GoogleOAuthService googleOAuthService;

    public GoogleAuthController(GoogleOAuthService googleOAuthService) {
        this.googleOAuthService = googleOAuthService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<Usuario> confirmVerification(
            @RequestBody GoogleVerificationDTO dto,
            jakarta.servlet.http.HttpSession session
    ) {
        Usuario usuario = googleOAuthService.confirmVerification(
                dto.email(),
                dto.nome(),
                dto.cpf(),
                dto.dataNascimento(),
                dto.telefone(),
                dto.tipoUsuario()
        );
        if (usuario != null && session != null) {
            session.setAttribute("usuarioId", usuario.getId());
        }
        return ResponseEntity.ok(usuario);
    }
}
