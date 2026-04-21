package com.workonnection.backend.service;

import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Notificacao;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class NotificacaoService {
    
    private static final int MAX_NOTIFICACOES = 50;

    private final UsuarioRepository usuarioRepository;

    public NotificacaoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ── Criar notificação para outro usuário ──────────────────────────────────

    public void criar(String destinatarioId, String remetenteId, String remetenteNome,
                      String tipo, String mensagem, String vagaId) {
        
        //Não notifica a si mesmo
        if (destinatarioId.equals(remetenteId)) return;

        Usuario destinatario = usuarioRepository.findById(destinatarioId).orElse(null);
        if (destinatario == null) return;
        
        List<Notificacao> lista = new ArrayList<>(
            destinatario.getNotificacoes() != null ? destinatario.getNotificacoes() : List.of()
        );

        Notificacao nova = new Notificacao(
            UUID.randomUUID().toString(),
            tipo, mensagem, remetenteId, remetenteNome, vagaId, Instant.now()
        );

        lista.add(0, nova); //mais recente primeiro

        if (lista.size() > MAX_NOTIFICACOES) {
            lista = lista.subList(0, MAX_NOTIFICACOES);
        }

        destinatario.setNotificacoes(lista);
        usuarioRepository.save(destinatario);
    }

    // ── Listar ────────────────────────────────────────────────────────────────

    public List<Notificacao> listar(String usuarioId) {
        Usuario u = buscarOuErro(usuarioId);
        List<Notificacao> lista = u.getNotificacoes();

        if (lista == null) return List.of();
        
        //Ordem decrescente por data
        lista.sort(Comparator.comparing(Notificacao::getCriadaEm).reversed());
        return lista;
    }

    // ── Marcar como lida ──────────────────────────────────────────────────────

    public void marcarLida(String usuarioId, String notificacaoId) {
        Usuario u = buscarOuErro(usuarioId);
        if (u.getNotificacoes() == null) return;

        u.getNotificacoes().stream()
                .filter(n -> n.getId().equals(notificacaoId))
                .findFirst()
                .ifPresent(n -> n.setLida(true));
        usuarioRepository.save(u);
    }

    public void marcarTodasLidas(String usuarioId) {
        Usuario u = buscarOuErro(usuarioId);
        if (u.getNotificacoes() == null) return;

        u.getNotificacoes().forEach(n -> n.setLida(true));
        usuarioRepository.save(u);
    }

    // ── Excluir ───────────────────────────────────────────────────────────────

    public void excluir(String usuarioId, String notificacaoId) {
        Usuario u = buscarOuErro(usuarioId);
        if (u.getNotificacoes() == null) return;
        
        u.getNotificacoes().removeIf(n -> n.getId().equals(notificacaoId));
        usuarioRepository.save(u);
    }

    public void limparTodas(String usuarioId) {
        Usuario u = buscarOuErro(usuarioId);
        u.setNotificacoes(new ArrayList<>());
        usuarioRepository.save(u);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private Usuario buscarOuErro(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));
    }
}
