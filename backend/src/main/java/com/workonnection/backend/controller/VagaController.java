package com.workonnection.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workonnection.backend.dto.ComentarioDTO;
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.VagaService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/vagas")
@CrossOrigin(
    origins = { "http://localhost:8080", "http://127.0.0.1:5500", "http://localhost:5500" },
    allowCredentials = "true"
)
public class VagaController {

    private final VagaService service;
    public VagaController(VagaService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<VagaResponseDTO> criar(@RequestBody VagaDTO dto, HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(dto, uid(session)));
    }

    @GetMapping
    public List<VagaResponseDTO> listar() { return service.listarTodas(); }

    @GetMapping("/minhas")
    public List<VagaResponseDTO> minhas(HttpSession session) { return service.listarPorUsuario(uid(session)); }

    @PutMapping("/{id}")
    public ResponseEntity<VagaResponseDTO> editar(@PathVariable String id, @RequestBody VagaDTO dto, HttpSession session) {
        return ResponseEntity.ok(service.editar(id, dto, uid(session)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id, HttpSession session) {
        service.excluir(id, uid(session));
        return ResponseEntity.noContent().build();
    }

    // ── Like / Dislike ────────────────────────────────────────────────────────

    @PostMapping("/{id}/like")
    public ResponseEntity<VagaResponseDTO> like(@PathVariable String id, HttpSession session) {
        return ResponseEntity.ok(service.like(id, uid(session)));
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<VagaResponseDTO> dislike(@PathVariable String id, HttpSession session) {
        return ResponseEntity.ok(service.dislike(id, uid(session)));
    }

    // ── Comentários ───────────────────────────────────────────────────────────

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<VagaResponseDTO> comentar(
            @PathVariable String id,
            @RequestBody ComentarioDTO dto,
            HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.comentar(id, uid(session), dto));
    }

    @DeleteMapping("/{vagaId}/comentarios/{comentarioId}")
    public ResponseEntity<VagaResponseDTO> excluirComentario(
            @PathVariable String vagaId,
            @PathVariable String comentarioId,
            HttpSession session) {
        return ResponseEntity.ok(service.excluirComentario(vagaId, comentarioId, uid(session)));
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private String uid(HttpSession s) {
        String id = (String) s.getAttribute("usuarioId");
        if (id == null) throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        return id;
    }
}