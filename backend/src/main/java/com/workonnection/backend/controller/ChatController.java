package com.workonnection.backend.controller;

import com.workonnection.backend.dto.ConversaResumoDTO;
import com.workonnection.backend.dto.MensagemDTO;
import com.workonnection.backend.dto.MensagemResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/conversas")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<List<ConversaResumoDTO>> listarConversas(
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        return ResponseEntity.ok(chatService.listarConversas(usuarioId));
    }

    @GetMapping("/{contatoId}/mensagens")
    public ResponseEntity<List<MensagemResponseDTO>> buscarHistorico(
            @PathVariable String contatoId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        return ResponseEntity.ok(chatService.buscarHistorico(usuarioId, contatoId));
    }

    @PostMapping("/{contatoId}/mensagens")
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(
            @PathVariable String contatoId,
            @RequestBody MensagemDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        MensagemResponseDTO enviada = chatService.enviarMensagem(usuarioId, contatoId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(enviada);
    }

    @PutMapping("/{contatoId}/ler")
    public ResponseEntity<Void> marcarComoLidas(
            @PathVariable String contatoId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        chatService.marcarComoLidas(usuarioId, contatoId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/mensagens/{mensagemId}")
    public ResponseEntity<MensagemResponseDTO> editarMensagem(
            @PathVariable String mensagemId,
            @RequestBody MensagemDTO dto,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        MensagemResponseDTO editada = chatService.editarMensagem(usuarioId, mensagemId, dto);
        return ResponseEntity.ok(editada);
    }

    @DeleteMapping("/mensagens/{mensagemId}")
    public ResponseEntity<Void> excluirMensagem(
            @PathVariable String mensagemId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        chatService.excluirMensagem(usuarioId, mensagemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{contatoId}")
    public ResponseEntity<Void> excluirConversa(
            @PathVariable String contatoId,
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        chatService.excluirConversa(usuarioId, contatoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nao-lidas/total")
    public ResponseEntity<Map<String, Long>> totalNaoLidas(
            HttpServletRequest request,
            HttpSession session
    ) {
        String usuarioId = getLoggerUserId(request, session);
        long total = chatService.contarTotalNaoLidas(usuarioId);
        return ResponseEntity.ok(Map.of("total", total));
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