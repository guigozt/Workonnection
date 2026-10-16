package com.workonnection.backend.controller;

import com.workonnection.backend.dto.CandidaturaCreateDTO;
import com.workonnection.backend.dto.CandidaturaResponseDTO;
import com.workonnection.backend.dto.FeedbackRecusaDTO;
import com.workonnection.backend.dto.StatusUpdateDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.CandidaturaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidaturas")
public class CandidaturaController {

    private final CandidaturaService service;

    public CandidaturaController(CandidaturaService service) {
        this.service = service;
    }

    @PostMapping("/vaga/{vagaId}")
    public ResponseEntity<CandidaturaResponseDTO> candidatar(
            @PathVariable String vagaId,
            @RequestBody(required = false) CandidaturaCreateDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String candidatoId = getLoggedUserId(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.candidatar(vagaId, candidatoId, dto));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarMinhas(
            HttpServletRequest request,
            HttpSession session
    ) {
        String candidatoId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.listarMinhas(candidatoId));
    }

    @GetMapping("/gerenciar")
    public ResponseEntity<List<CandidaturaResponseDTO>> gerenciarRecebidas(
            @RequestParam(required = false) String vagaId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String contratanteId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.gerenciarRecebidas(contratanteId, vagaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidaturaResponseDTO> buscarPorId(
            @PathVariable String id,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.buscarPorId(id, userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CandidaturaResponseDTO> atualizarStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String contratanteId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.atualizarStatus(id, contratanteId, dto));
    }

    @PostMapping("/{id}/recusar")
    public ResponseEntity<CandidaturaResponseDTO> recusarComFeedback(
            @PathVariable String id,
            @RequestBody FeedbackRecusaDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String contratanteId = getLoggedUserId(request, session);
        return ResponseEntity.ok(service.recusarComFeedback(id, contratanteId, dto));
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
