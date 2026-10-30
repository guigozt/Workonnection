package com.workonnection.backend.service;

import com.workonnection.backend.dto.FeedbackCreateDTO;
import com.workonnection.backend.dto.FeedbackResponseDTO;
import com.workonnection.backend.dto.StatusFeedbackCandidaturaDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.*;
import com.workonnection.backend.repository.CandidaturaRepository;
import com.workonnection.backend.repository.FeedbackRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private CandidaturaRepository candidaturaRepository;

    @Mock
    private VagaRepository vagaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private FeedbackService feedbackService;

    private Usuario contratante;
    private Usuario candidato;
    private Vaga vaga;
    private Candidatura candidatura;

    @BeforeEach
    void setUp() {
        contratante = new Usuario();
        contratante.setId("contratante-1");
        contratante.setNome("Empresa Tech");
        contratante.setTipoUsuario("Empresa");

        candidato = new Usuario();
        candidato.setId("candidato-1");
        candidato.setNome("Dev Júnior");
        candidato.setTipoUsuario("Estudante");

        vaga = new Vaga();
        vaga.setId("vaga-1");
        vaga.setCargo("Desenvolvedor Frontend");
        vaga.setUsuarioId("contratante-1");

        candidatura = new Candidatura();
        candidatura.setId("cand-1");
        candidatura.setVagaId("vaga-1");
        candidatura.setContratanteId("contratante-1");
        candidatura.setCandidatoId("candidato-1");
        candidatura.setStatus(StatusCandidatura.CONCLUIDO);
    }

    @Test
    @DisplayName("Contratante envia feedback com sucesso após aceitação/conclusão")
    void testContratanteEnviaFeedbackComSucesso() {
        FeedbackCreateDTO dto = new FeedbackCreateDTO();
        dto.setNotaGeral(5);
        dto.setMotivoPrincipal("Excelente desempenho técnico e boa comunicação.");
        dto.setPontosFortes(List.of("Pontualidade", "Proatividade"));
        dto.setDicaConstrutiva("Continue estudando arquitetura limpa.");

        when(candidaturaRepository.findById("cand-1")).thenReturn(Optional.of(candidatura));
        when(feedbackRepository.existsByCandidaturaIdAndAutorId("cand-1", "contratante-1")).thenReturn(false);
        when(usuarioRepository.findById("contratante-1")).thenReturn(Optional.of(contratante));
        when(usuarioRepository.findById("candidato-1")).thenReturn(Optional.of(candidato));
        when(vagaRepository.findById("vaga-1")).thenReturn(Optional.of(vaga));
        when(feedbackRepository.save(any(Feedback.class))).thenAnswer(invocation -> {
            Feedback f = invocation.getArgument(0);
            f.setId("feed-1");
            return f;
        });

        FeedbackResponseDTO response = feedbackService.enviarFeedback("cand-1", "contratante-1", dto);

        assertNotNull(response);
        assertEquals("feed-1", response.getId());
        assertEquals("CONTRATANTE", response.getTipoAutor());
        assertEquals("ACEITO", response.getDecisao());
        assertEquals(5, response.getNotaGeral());
        assertEquals("candidato-1", response.getDestinatarioId());
        verify(notificacaoService, times(1)).criar(eq("candidato-1"), eq("contratante-1"), anyString(), eq("contratacao_sucesso"), anyString(), eq("cand-1"));
        verify(notificacaoService, times(1)).criar(eq("contratante-1"), eq("candidato-1"), anyString(), eq("contratacao_sucesso"), anyString(), eq("cand-1"));
        verify(vagaRepository, times(1)).deleteById("vaga-1");
    }

    @Test
    @DisplayName("Candidato envia feedback sobre a empresa e processo seletivo")
    void testCandidatoEnviaFeedbackSobreEmpresa() {
        FeedbackCreateDTO dto = new FeedbackCreateDTO();
        dto.setNotaGeral(5);
        dto.setAvaliacaoProcesso("Processo muito transparente e rápido.");
        dto.setAvaliacaoEmpresa("Empresa acolhedora e com suporte.");
        dto.setClarezaRequisitos(5);
        dto.setComunicacaoContratante(5);

        when(candidaturaRepository.findById("cand-1")).thenReturn(Optional.of(candidatura));
        when(feedbackRepository.existsByCandidaturaIdAndAutorId("cand-1", "candidato-1")).thenReturn(false);
        when(usuarioRepository.findById("candidato-1")).thenReturn(Optional.of(candidato));
        when(usuarioRepository.findById("contratante-1")).thenReturn(Optional.of(contratante));
        when(vagaRepository.findById("vaga-1")).thenReturn(Optional.of(vaga));
        when(feedbackRepository.save(any(Feedback.class))).thenAnswer(invocation -> {
            Feedback f = invocation.getArgument(0);
            f.setId("feed-2");
            return f;
        });

        FeedbackResponseDTO response = feedbackService.enviarFeedback("cand-1", "candidato-1", dto);

        assertNotNull(response);
        assertEquals("feed-2", response.getId());
        assertEquals("CANDIDATO", response.getTipoAutor());
        assertEquals("contratante-1", response.getDestinatarioId());
        assertEquals("Processo muito transparente e rápido.", response.getAvaliacaoProcesso());
        verify(notificacaoService, times(1)).criar(eq("contratante-1"), eq("candidato-1"), anyString(), eq("feedback_recebido"), anyString(), eq("cand-1"));
    }

    @Test
    @DisplayName("Impede feedback antes da etapa de contratação/decisão")
    void testImpedeFeedbackAntesDaDecisao() {
        candidatura.setStatus(StatusCandidatura.INSCRITO);
        when(candidaturaRepository.findById("cand-1")).thenReturn(Optional.of(candidatura));

        ApiException ex = assertThrows(ApiException.class, () ->
                feedbackService.enviarFeedback("cand-1", "contratante-1", new FeedbackCreateDTO())
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertTrue(ex.getMessage().contains("ainda não atingiu a etapa de contratação"));
    }

    @Test
    @DisplayName("Impede envio de feedback duplicado pelo mesmo autor")
    void testImpedeFeedbackDuplicado() {
        when(candidaturaRepository.findById("cand-1")).thenReturn(Optional.of(candidatura));
        when(feedbackRepository.existsByCandidaturaIdAndAutorId("cand-1", "contratante-1")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () ->
                feedbackService.enviarFeedback("cand-1", "contratante-1", new FeedbackCreateDTO())
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
    }

    @Test
    @DisplayName("Consulta feedbacks recebidos pelo perfil")
    void testListarFeedbacksDoPerfil() {
        Feedback f1 = new Feedback();
        f1.setId("f-1");
        f1.setDestinatarioId("candidato-1");
        f1.setNotaGeral(5);
        f1.setMotivoPrincipal("Ótimo trabalho");

        when(feedbackRepository.findByDestinatarioIdOrderByCriadoEmDesc(eq("candidato-1"), any(Pageable.class)))
                .thenReturn(List.of(f1));

        List<FeedbackResponseDTO> lista = feedbackService.listarFeedbacksDoPerfil("candidato-1", 5);

        assertNotNull(lista);
        assertEquals(1, lista.size());
        assertEquals("f-1", lista.get(0).getId());
        assertEquals("Ótimo trabalho", lista.get(0).getMotivoPrincipal());
    }

    @Test
    @DisplayName("Consulta status de feedbacks da candidatura")
    void testBuscarStatusFeedback() {
        Feedback fContratante = new Feedback();
        fContratante.setId("fc-1");
        fContratante.setAutorId("contratante-1");
        fContratante.setTipoAutor("CONTRATANTE");

        when(candidaturaRepository.findById("cand-1")).thenReturn(Optional.of(candidatura));
        when(feedbackRepository.findByCandidaturaId("cand-1")).thenReturn(List.of(fContratante));

        StatusFeedbackCandidaturaDTO status = feedbackService.buscarStatusFeedback("cand-1", "contratante-1");

        assertTrue(status.isContratanteEnviou());
        assertFalse(status.isCandidatoEnviou());
        assertNotNull(status.getMeuFeedback());
        assertNull(status.getFeedbackRecebido());
    }
}
