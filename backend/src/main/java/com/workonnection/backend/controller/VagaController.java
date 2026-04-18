package com.workonnection.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.VagaService;
 
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/vagas")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class VagaController {

    private final VagaService service;

    public VagaController(VagaService service) {
        this.service = service;
    }

    // ── POST /vagas → Criar ───────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<VagaResponseDTO> criar(@RequestBody VagaDTO dto, HttpSession session) {
        String usuarioId = getUsuarioId(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(dto, usuarioId));
    }

    // ── GET /vagas → Listar todas ─────────────────────────────────────────────

    @GetMapping
    public List<VagaResponseDTO> listar() {
        return service.listarTodas();
    }
 
    // ── GET /vagas/minhas → Vagas do usuário logado ───────────────────────────

    @GetMapping("/minhas")
    public List<VagaResponseDTO> minhas(HttpSession session) {
        return service.listarPorUsuario(getUsuarioId(session));
    }

    // ── PUT /vagas/{id} → Editar ──────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<VagaResponseDTO> editar(
            @PathVariable String id,
            @RequestBody VagaDTO dto,
            HttpSession session) {
        String usuarioId = getUsuarioId(session);
        return ResponseEntity.ok(service.editar(id, dto, usuarioId));
    }

    // ── DELETE /vagas/{id} → Excluir ──────────────────────────────────────────
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id, HttpSession session) {
        String usuarioId = getUsuarioId(session);
        service.excluir(id, usuarioId);
        return ResponseEntity.noContent().build(); // 204
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    
    private String getUsuarioId(HttpSession session) {
        String id = (String) session.getAttribute("usuarioId");
        if (id == null) throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        return id;
    }
}