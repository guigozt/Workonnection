package com.workonnection.backend.controller;

import com.workonnection.backend.dto.FeedbackCreateDTO;
import com.workonnection.backend.dto.FeedbackResponseDTO;
import com.workonnection.backend.dto.StatusFeedbackCandidaturaDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    /**
     * Envia o formulário de feedback para a candidatura (Contratante ou Candidato)
     */
    @PostMapping("/candidatura/{candidaturaId}")
    public ResponseEntity<FeedbackResponseDTO> enviarFeedback(
            @PathVariable String candidaturaId,
            @RequestBody FeedbackCreateDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggedUserId(request, session);
        FeedbackResponseDTO salvo = service.enviarFeedback(candidaturaId, usuarioId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /**
     * Retorna os feedbacks que um usuário recebeu (para renderizar na tela de Perfil)
     * Ex: /feedbacks/usuario/{usuarioId}?limite=5
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FeedbackResponseDTO>> listarFeedbacksDoPerfil(
            @PathVariable String usuarioId,
            @RequestParam(defaultValue = "10") int limite
    ) {
        return ResponseEntity.ok(service.listarFeedbacksDoPerfil(usuarioId, limite));
    }

    /**
     * Consulta o status de preenchimento dos feedbacks de uma candidatura
     */
    @GetMapping("/candidatura/{candidaturaId}/status")
    public ResponseEntity<StatusFeedbackCandidaturaDTO> buscarStatusFeedback(
            @PathVariable String candidaturaId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.buscarStatusFeedback(candidaturaId, usuarioId));
    }

    private String getLoggedUserId(HttpServletRequest request, HttpSession session) {
        if (request != null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7).trim();
                if (!token.isBlank()) {
                    return token;
                }
            }
        }
        if (session != null) {
            String id = (String) session.getAttribute("usuarioId");
            if (id != null && !id.isBlank()) {
                return id;
            }
        }
        throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
    }
}
