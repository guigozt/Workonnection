package com.workonnection.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workonnection.backend.dto.ComentarioDTO;
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.VagaService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/vagas")
public class VagaController {

    private final VagaService service;
    
    public VagaController(VagaService service) { 
        this.service = service; 
    }

    @PostMapping
    public ResponseEntity<VagaResponseDTO> criar(
            @RequestBody VagaDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(dto, userId));
    }

    @GetMapping
    public ResponseEntity<List<VagaResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String modalidade,
            HttpServletRequest request,
            HttpSession session
    ) { 
        String userId = getLoggerUserIdOptional(request, session);
        return ResponseEntity.ok(service.filtrar(busca, tipo, modalidade, userId)); 
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<VagaResponseDTO>> minhas(
            HttpServletRequest request,
            HttpSession session
    ) { 
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.listarPorUsuario(userId)); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<VagaResponseDTO> editar(
            @PathVariable String id,
            @RequestBody VagaDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.editar(id, dto, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable String id,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        service.excluir(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<VagaResponseDTO> like(
            @PathVariable String id,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.like(id, userId));
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<VagaResponseDTO> dislike(
            @PathVariable String id,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.dislike(id, userId));
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<VagaResponseDTO> comentar(
            @PathVariable String id,
            @RequestBody ComentarioDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.comentar(id, userId, dto));
    }

    @DeleteMapping("/{id}/comentarios/{comentarioId}")
    public ResponseEntity<VagaResponseDTO> excluirComentario(
            @PathVariable String id,
            @PathVariable String comentarioId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.excluirComentario(id, comentarioId, userId));
    }

    private String getLoggerUserId(HttpServletRequest request, HttpSession session) {
        String id = getLoggerUserIdOptional(request, session);
        if (id == null) {
            throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        }
        return id;
    }

    private String getLoggerUserIdOptional(HttpServletRequest request, HttpSession session) {
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
        return null;
    }
}
