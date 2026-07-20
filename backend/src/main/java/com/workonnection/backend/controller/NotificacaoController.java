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
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Notificacao>> listar(HttpSession session) {
        String userId = getLoggedUserId(session);
        return ResponseEntity.ok(service.listar(userId));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarLida(@PathVariable String id, HttpSession session) {
        String userId = getLoggedUserId(session);
        service.marcarLida(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/lidas")
    public ResponseEntity<Void> marcarTodasLidas(HttpSession session) {
        String userId = getLoggedUserId(session);
        service.marcarTodasLidas(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id, HttpSession session) {
        String userId = getLoggedUserId(session);
        service.excluir(userId, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> limparTodas(HttpSession session) {
        String userId = getLoggedUserId(session);
        service.limparTodas(userId);
        return ResponseEntity.noContent().build();
    }

    private String getLoggedUserId(HttpSession session) {
        String id = (String) session.getAttribute("usuarioId");
        if (id == null) {
            throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        }
        return id;
    }
}