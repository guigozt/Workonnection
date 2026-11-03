package com.workonnection.backend.service;

import com.workonnection.backend.dto.ConversaResumoDTO;
import com.workonnection.backend.dto.MensagemDTO;
import com.workonnection.backend.dto.MensagemResponseDTO;
import com.workonnection.backend.dto.UsuarioPublicoDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Mensagem;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.MensagemRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private MensagemRepository mensagemRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PusherService pusherService;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private ChatService chatService;

    private Mensagem msg1;

    @BeforeEach
    void setUp() {
        msg1 = new Mensagem("u1", "u2", "Olá, tudo bem?");
        msg1.setId("m1");
        msg1.setDataEnvio(Instant.now());
    }

    @Test
    @DisplayName("Deve enviar mensagem com sucesso, disparar Pusher e validar limites de conteúdo")
    void enviarMensagem() {
        assertThrows(ApiException.class, () -> chatService.enviarMensagem("u1", "u2", new MensagemDTO("   ")));
        assertThrows(ApiException.class, () -> chatService.enviarMensagem("u1", "u2", new MensagemDTO("a".repeat(2001))));

        when(mensagemRepository.save(any(Mensagem.class))).thenAnswer(inv -> {
            Mensagem m = inv.getArgument(0);
            m.setId("m-nova");
            return m;
        });

        MensagemResponseDTO res = chatService.enviarMensagem("u1", "u2", new MensagemDTO("Bom dia!"));
        assertEquals("m-nova", res.id());
        assertEquals("Bom dia!", res.conteudo());
        verify(pusherService, times(2)).dispararEvento(anyString(), eq("nova-mensagem"), any());
    }

    @Test
    @DisplayName("Deve listar conversas agrupadas por contato, buscar histórico, contar e marcar como lidas")
    void listarHistoricoEMarcarLidas() {
        Usuario contato = new Usuario();
        contato.setId("u2");
        contato.setNome("Maria");

        Mensagem msgRecebida = new Mensagem("u2", "u1", "Resposta");
        msgRecebida.setId("m2");
        msgRecebida.setDataEnvio(Instant.now().plusSeconds(10));

        when(mensagemRepository.findAll()).thenReturn(List.of(msg1, msgRecebida));
        when(usuarioRepository.findById("u2")).thenReturn(Optional.of(contato));
        when(usuarioService.toPublicResponse(contato)).thenReturn(new UsuarioPublicoDTO("u2", "Maria", "EMPRESA", null));

        List<ConversaResumoDTO> conversas = chatService.listarConversas("u1");
        assertEquals(1, conversas.size());
        assertEquals(1L, conversas.get(0).naoLidasCount());
        assertEquals("Resposta", conversas.get(0).ultimaMensagem().conteudo());

        when(mensagemRepository.findHistoricoSemExcluidas("u1", "u2")).thenReturn(List.of(msgRecebida, msg1));
        assertEquals(2, chatService.buscarHistorico("u1", "u2").size());

        when(mensagemRepository.findByRemetenteIdAndDestinatarioIdAndLidaFalse("u2", "u1")).thenReturn(List.of(msgRecebida));
        chatService.marcarComoLidas("u1", "u2");
        assertTrue(msgRecebida.isLida());
        verify(mensagemRepository).saveAll(anyList());
        verify(pusherService).dispararEvento(eq("chat-u2"), eq("mensagens-lidas"), any());

        when(mensagemRepository.countByDestinatarioIdAndLidaFalseAndExcluidaParaNotContaining("u1", "u1")).thenReturn(3L);
        assertEquals(3L, chatService.contarTotalNaoLidas("u1"));
    }

    @Test
    @DisplayName("Deve editar mensagem pelo remetente e excluir mensagens/conversas logicamente")
    void editarEExcluirMensagens() {
        when(mensagemRepository.findById("m1")).thenReturn(Optional.of(msg1));
        when(mensagemRepository.save(any(Mensagem.class))).thenAnswer(inv -> inv.getArgument(0));

        // Destinatário não pode editar
        ApiException exForb = assertThrows(ApiException.class, () ->
                chatService.editarMensagem("u2", "m1", new MensagemDTO("Editado")));
        assertEquals(HttpStatus.FORBIDDEN, exForb.getStatus());

        assertThrows(ApiException.class, () -> chatService.editarMensagem("u1", "m1", new MensagemDTO("")));

        MensagemResponseDTO editada = chatService.editarMensagem("u1", "m1", new MensagemDTO("Texto atualizado"));
        assertTrue(editada.editada());
        assertEquals("Texto atualizado", editada.conteudo());

        // Terceiro não pode excluir
        assertThrows(ApiException.class, () -> chatService.excluirMensagem("u3", "m1"));

        // Participante exclui logicamente
        chatService.excluirMensagem("u1", "m1");
        assertTrue(msg1.getExcluidaPara().contains("u1"));

        // Excluir conversa inteira
        Mensagem mExtra = new Mensagem("u2", "u1", "Outra");
        when(mensagemRepository.findHistoricoSemExcluidas("u1", "u2")).thenReturn(List.of(mExtra));
        chatService.excluirConversa("u1", "u2");
        assertTrue(mExtra.getExcluidaPara().contains("u1"));
        verify(mensagemRepository).saveAll(anyList());
    }
}

