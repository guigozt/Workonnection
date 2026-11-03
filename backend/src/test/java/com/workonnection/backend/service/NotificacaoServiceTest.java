package com.workonnection.backend.service;

import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Notificacao;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacaoServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private NotificacaoService notificacaoService;

    private Usuario destinatario;

    @BeforeEach
    void setUp() {
        destinatario = new Usuario();
        destinatario.setId("u1");
        destinatario.setNotificacoes(new ArrayList<>());
    }

    @Test
    @DisplayName("Deve criar notificações respeitando limite máximo e ignorando auto-notificação")
    void criarNotificacoes() {
        // Auto-notificação ignorada
        notificacaoService.criar("u1", "u1", "Paulo", "like", "msg", "v1");
        notificacaoService.criar("", "u2", "Paulo", "like", "msg", "v1");
        verify(usuarioRepository, never()).save(any());

        // Preenche 50 notificações e cria a 51ª para validar corte em MAX_NOTIFICACOES
        List<Notificacao> iniciais = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            iniciais.add(new Notificacao("n-" + i, "like", "msg", "u2", "Maria", "v1", Instant.now()));
        }
        destinatario.setNotificacoes(iniciais);
        when(usuarioRepository.findById("u1")).thenReturn(Optional.of(destinatario));

        notificacaoService.criar("u1", "u2", "Maria", "comentario", "Nova!", "v1");
        assertEquals(50, destinatario.getNotificacoes().size());
        assertEquals("Nova!", destinatario.getNotificacoes().get(0).getMensagem());
        verify(usuarioRepository).save(destinatario);
    }

    @Test
    @DisplayName("Deve listar, marcar como lida, marcar todas, excluir e limpar notificações")
    void gerenciarNotificacoes() {
        Notificacao n1 = new Notificacao("n1", "like", "Antiga", "u2", "Maria", "v1", Instant.now().minusSeconds(60));
        Notificacao n2 = new Notificacao("n2", "like", "Recente", "u2", "Maria", "v1", Instant.now());
        destinatario.setNotificacoes(new ArrayList<>(List.of(n1, n2)));
        when(usuarioRepository.findById("u1")).thenReturn(Optional.of(destinatario));

        List<Notificacao> listadas = notificacaoService.listar("u1");
        assertEquals("n2", listadas.get(0).getId());

        notificacaoService.marcarLida("u1", "n1");
        assertTrue(n1.isLida());

        notificacaoService.marcarTodasLidas("u1");
        assertTrue(n2.isLida());

        notificacaoService.excluir("u1", "n1");
        assertEquals(1, destinatario.getNotificacoes().size());

        notificacaoService.limparTodas("u1");
        assertTrue(destinatario.getNotificacoes().isEmpty());

        when(usuarioRepository.findById("404")).thenReturn(Optional.empty());
        assertThrows(ApiException.class, () -> notificacaoService.listar("404"));
    }
}

