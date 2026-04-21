package com.workonnection.backend.controller;

import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Notificacao;
import com.workonnection.backend.service.NotificacaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacoes")
@CrossOrigin(
    origins = { "http://localhost:8080", "http://127.0.0.1:5500", "http://localhost:5500" },
    allowCredentials = "true"
)
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    // GET /notificacoes → lista todas do usuário logado (mais recentes primeiro)
    @GetMapping
    public ResponseEntity<List<Notificacao>> listar(HttpSession session) {
        return ResponseEntity.ok(service.listar(uid(session)));
    }

    // PATCH /notificacoes/{id}/lida → marca uma como lida
    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarLida(@PathVariable String id, HttpSession session) {
        service.marcarLida(uid(session), id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /notificacoes/lidas → marca todas como lidas
    @PatchMapping("/lidas")
    public ResponseEntity<Void> marcarTodasLidas(HttpSession session) {
        service.marcarTodasLidas(uid(session));
        return ResponseEntity.noContent().build();
    }

    // DELETE /notificacoes/{id} → exclui uma notificação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id, HttpSession session) {
        service.excluir(uid(session), id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /notificacoes → limpa todas
    @DeleteMapping
    public ResponseEntity<Void> limparTodas(HttpSession session) {
        service.limparTodas(uid(session));
        return ResponseEntity.noContent().build();
    }

    private String uid(HttpSession s) {
        String id = (String) s.getAttribute("usuarioId");
        if (id == null) throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        return id;
    }
}