package com.workonnection.backend.controller;

import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Notificacao;
import com.workonnection.backend.service.NotificacaoService;
import jakarta.servlet.http.HttpServletRequest;
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
    public ResponseEntity<List<Notificacao>> listar(HttpServletRequest request, HttpSession session) {
        String userId = getLoggerUserId(request, session);
        return ResponseEntity.ok(service.listar(userId));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarLida(@PathVariable String id, HttpServletRequest request, HttpSession session) {
        String userId = getLoggerUserId(request, session);
        service.marcarLida(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/lidas")
    public ResponseEntity<Void> marcarTodasLidas(HttpServletRequest request, HttpSession session) {
        String userId = getLoggerUserId(request, session);
        service.marcarTodasLidas(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id, HttpServletRequest request, HttpSession session) {
        String userId = getLoggerUserId(request, session);
        service.excluir(userId, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> limparTodas(HttpServletRequest request, HttpSession session) {
        String userId = getLoggerUserId(request, session);
        service.limparTodas(userId);
        return ResponseEntity.noContent().build();
    }

    private String getLoggerUserId(HttpServletRequest request, HttpSession session) {
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