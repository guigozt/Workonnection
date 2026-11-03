package com.workonnection.backend.controller;

import com.workonnection.backend.dto.MensagemResponseDTO;
import com.workonnection.backend.dto.StatusFeedbackCandidaturaDTO;
import com.workonnection.backend.dto.FeedbackResponseDTO;
import com.workonnection.backend.exception.GlobalExceptionHandler;
import com.workonnection.backend.model.Notificacao;
import com.workonnection.backend.service.ChatService;
import com.workonnection.backend.service.FeedbackService;
import com.workonnection.backend.service.NotificacaoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class OutrosControllersTest {

    @Mock
    private ChatService chatService;

    @Mock
    private FeedbackService feedbackService;

    @Mock
    private NotificacaoService notificacaoService;

    @Test
    @DisplayName("Deve cobrir todas as rotas de ChatController")
    void chatControllerRotas() throws Exception {
        MockMvc mvc = MockMvcBuilders
                .standaloneSetup(new ChatController(chatService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mvc.perform(get("/conversas")).andExpect(status().isUnauthorized());

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", "u1");
        when(chatService.listarConversas("u1")).thenReturn(List.of());
        mvc.perform(get("/conversas").session(session)).andExpect(status().isOk());

        when(chatService.buscarHistorico("u1", "u2")).thenReturn(List.of());
        mvc.perform(get("/conversas/u2/mensagens").header("Authorization", "Bearer u1"))
                .andExpect(status().isOk());

        MensagemResponseDTO msgDto = new MensagemResponseDTO("m1", "u1", "u2", "Oi", Instant.now(), false, null, false);
        when(chatService.enviarMensagem(eq("u1"), eq("u2"), any())).thenReturn(msgDto);
        mvc.perform(post("/conversas/u2/mensagens")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"conteudo\":\"Oi\"}"))
                .andExpect(status().isCreated());

        mvc.perform(put("/conversas/u2/ler").header("Authorization", "Bearer u1"))
                .andExpect(status().isNoContent());

        when(chatService.editarMensagem(eq("u1"), eq("m1"), any())).thenReturn(msgDto);
        mvc.perform(put("/conversas/mensagens/m1")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"conteudo\":\"Edit\"}"))
                .andExpect(status().isOk());

        mvc.perform(delete("/conversas/mensagens/m1").header("Authorization", "Bearer u1"))
                .andExpect(status().isNoContent());

        mvc.perform(delete("/conversas/u2").header("Authorization", "Bearer u1"))
                .andExpect(status().isNoContent());

        when(chatService.contarTotalNaoLidas("u1")).thenReturn(4L);
        mvc.perform(get("/conversas/nao-lidas/total").header("Authorization", "Bearer u1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(4));
    }

    @Test
    @DisplayName("Deve cobrir todas as rotas de FeedbackController e NotificacaoController")
    void feedbackENotificacaoControllersRotas() throws Exception {
        MockMvc mvcFeedback = MockMvcBuilders
                .standaloneSetup(new FeedbackController(feedbackService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mvcFeedback.perform(get("/feedbacks/candidatura/c1/status")).andExpect(status().isUnauthorized());

        FeedbackResponseDTO fbResp = new FeedbackResponseDTO();
        fbResp.setId("fb-1");
        when(feedbackService.enviarFeedback(eq("c1"), eq("u1"), any())).thenReturn(fbResp);
        mvcFeedback.perform(post("/feedbacks/candidatura/c1")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notaGeral\":5}"))
                .andExpect(status().isCreated());

        when(feedbackService.listarFeedbacksDoPerfil("u1", 10)).thenReturn(List.of(fbResp));
        mvcFeedback.perform(get("/feedbacks/usuario/u1")).andExpect(status().isOk());

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", "u1");
        when(feedbackService.buscarStatusFeedback("c1", "u1"))
                .thenReturn(new StatusFeedbackCandidaturaDTO(true, false, fbResp, null));
        mvcFeedback.perform(get("/feedbacks/candidatura/c1/status").session(session))
                .andExpect(status().isOk());

        // NotificacaoController
        MockMvc mvcNotif = MockMvcBuilders
                .standaloneSetup(new NotificacaoController(notificacaoService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mvcNotif.perform(get("/notificacoes")).andExpect(status().isUnauthorized());

        when(notificacaoService.listar("u1")).thenReturn(List.of(new Notificacao()));
        mvcNotif.perform(get("/notificacoes").header("Authorization", "Bearer u1")).andExpect(status().isOk());
        mvcNotif.perform(patch("/notificacoes/n1/lida").session(session)).andExpect(status().isNoContent());
        mvcNotif.perform(patch("/notificacoes/lidas").header("Authorization", "Bearer u1")).andExpect(status().isNoContent());
        mvcNotif.perform(delete("/notificacoes/n1").header("Authorization", "Bearer u1")).andExpect(status().isNoContent());
        mvcNotif.perform(delete("/notificacoes").header("Authorization", "Bearer u1")).andExpect(status().isNoContent());
    }
}

