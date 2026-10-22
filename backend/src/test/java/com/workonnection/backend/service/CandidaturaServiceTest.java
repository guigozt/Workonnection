package com.workonnection.backend.service;

import com.workonnection.backend.dto.CandidaturaCreateDTO;
import com.workonnection.backend.dto.CandidaturaResponseDTO;
import com.workonnection.backend.dto.FeedbackRecusaDTO;
import com.workonnection.backend.dto.StatusUpdateDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.*;
import com.workonnection.backend.repository.CandidaturaRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidaturaServiceTest {

    @Mock
    private CandidaturaRepository candidaturaRepository;

    @Mock
    private VagaRepository vagaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private CandidaturaService candidaturaService;

    private Usuario candidato;
    private Usuario contratante;
    private Vaga vaga;

    @BeforeEach
    void setUp() {
        candidato = new Usuario();
        candidato.setId("candidato-123");
        candidato.setNome("João Estudante");
        candidato.setEmail("joao@email.com");
        candidato.setTipoUsuario("Estudante");

        contratante = new Usuario();
        contratante.setId("contratante-456");
        contratante.setNome("Empresa ABC");
        contratante.setEmail("contato@empresa.com");
        contratante.setTipoUsuario("Empresa");

        vaga = new Vaga();
        vaga.setId("vaga-789");
        vaga.setCargo("Desenvolvedor Frontend Júnior");
        vaga.setEmpresa("Empresa ABC");
        vaga.setUsuarioId("contratante-456");
        vaga.setTiposUsuario(List.of("Estudante", "Microempreendedor"));
    }

    // -------------------------------------------------------------
    // TESTES DE CANDIDATAR (POST /candidaturas/vaga/{vagaId})
    // -------------------------------------------------------------

    @Test
    @DisplayName("Deve candidatar com sucesso e notificar o contratante")
    void candidatar_ComSucesso_DeveSalvarENotificar() {
        CandidaturaCreateDTO dto = new CandidaturaCreateDTO("Olá, tenho muito interesse nesta vaga!");

        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(candidaturaRepository.existsByVagaIdAndCandidatoId("vaga-789", "candidato-123")).thenReturn(false);

        Candidatura salva = new Candidatura();
        salva.setId("cand-001");
        salva.setVagaId("vaga-789");
        salva.setCandidatoId("candidato-123");
        salva.setTipoCandidato("Estudante");
        salva.setContratanteId("contratante-456");
        salva.setStatus(StatusCandidatura.INSCRITO);
        salva.setMensagemApresentacao(dto.getMensagemApresentacao());
        salva.setCriadaEm(Instant.now());
        salva.setAtualizadaEm(Instant.now());

        when(candidaturaRepository.save(any(Candidatura.class))).thenReturn(salva);

        CandidaturaResponseDTO response = candidaturaService.candidatar("vaga-789", "candidato-123", dto);

        assertNotNull(response);
        assertEquals("cand-001", response.getId());
        assertEquals("vaga-789", response.getVagaId());
        assertEquals("candidato-123", response.getCandidatoId());
        assertEquals(StatusCandidatura.INSCRITO, response.getStatus());
        assertEquals("Desenvolvedor Frontend Júnior", response.getVagaCargo());
        assertEquals("João Estudante", response.getCandidatoNome());

        verify(candidaturaRepository).save(any(Candidatura.class));
        verify(notificacaoService).criar(
                eq("contratante-456"),
                eq("candidato-123"),
                eq("João Estudante"),
                eq("candidatura_nova"),
                contains("se candidatou para a sua vaga temporária"),
                eq("vaga-789")
        );
    }

    @Test
    @DisplayName("Deve falhar ao candidatar quando vagaId for nulo ou vazio")
    void candidatar_QuandoVagaIdInvalido_DeveLancarBadRequest() {
        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("", "candidato-123", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertTrue(ex.getMessage().contains("ID da vaga é obrigatório"));
    }

    @Test
    @DisplayName("Deve falhar ao candidatar quando vaga não for encontrada")
    void candidatar_QuandoVagaNaoEncontrada_DeveLancarNotFound() {
        when(vagaRepository.findById("vaga-inexistente")).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("vaga-inexistente", "candidato-123", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertTrue(ex.getMessage().contains("Vaga não encontrada"));
    }

    @Test
    @DisplayName("Deve falhar ao candidatar quando candidato não for encontrado")
    void candidatar_QuandoCandidatoNaoEncontrado_DeveLancarNotFound() {
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-inexistente")).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("vaga-789", "candidato-inexistente", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertTrue(ex.getMessage().contains("Usuário candidato não encontrado"));
    }

    @Test
    @DisplayName("Deve falhar se o contratante tentar se candidatar à sua própria vaga")
    void candidatar_QuandoContratanteTentaSeCandidatarNaPropriaVaga_DeveLancarBadRequest() {
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("contratante-456")).thenReturn(Optional.of(contratante));

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("vaga-789", "contratante-456", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertTrue(ex.getMessage().contains("não pode se candidatar à sua própria vaga"));
    }

    @Test
    @DisplayName("Deve falhar se o usuário já tiver se candidatado à mesma vaga (duplicidade)")
    void candidatar_QuandoJaInscrito_DeveLancarConflict() {
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(candidaturaRepository.existsByVagaIdAndCandidatoId("vaga-789", "candidato-123")).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("vaga-789", "candidato-123", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
        assertTrue(ex.getMessage().contains("já possui uma candidatura ativa"));
    }

    @Test
    @DisplayName("Deve falhar se o perfil do candidato não for compatível com o público-alvo da vaga")
    void candidatar_QuandoPerfilIncompativel_DeveLancarBadRequest() {
        vaga.setTiposUsuario(List.of("Estudante"));
        candidato.setTipoUsuario("Empresa");

        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(candidaturaRepository.existsByVagaIdAndCandidatoId("vaga-789", "candidato-123")).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.candidatar("vaga-789", "candidato-123", new CandidaturaCreateDTO())
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertTrue(ex.getMessage().contains("destinada especificamente"));
    }

    // -------------------------------------------------------------
    // TESTES DE LISTAGEM (GET /candidaturas/minhas e /gerenciar)
    // -------------------------------------------------------------

    @Test
    @DisplayName("listarMinhas deve retornar lista vazia se não houver candidaturas")
    void listarMinhas_QuandoSemCandidaturas_DeveRetornarVazio() {
        when(candidaturaRepository.findByCandidatoId("candidato-123")).thenReturn(Collections.emptyList());

        List<CandidaturaResponseDTO> resultado = candidaturaService.listarMinhas("candidato-123");

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("listarMinhas deve retornar candidaturas preenchidas com dados da vaga e candidato")
    void listarMinhas_ComCandidaturas_DeveRetornarPreenchidas() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setStatus(StatusCandidatura.INSCRITO);
        c1.setAtualizadaEm(Instant.now());

        when(candidaturaRepository.findByCandidatoId("candidato-123")).thenReturn(List.of(c1));
        when(vagaRepository.findAllById(anySet())).thenReturn(List.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));

        List<CandidaturaResponseDTO> resultado = candidaturaService.listarMinhas("candidato-123");

        assertEquals(1, resultado.size());
        assertEquals("Desenvolvedor Frontend Júnior", resultado.get(0).getVagaCargo());
        assertEquals("João Estudante", resultado.get(0).getCandidatoNome());
    }

    @Test
    @DisplayName("gerenciarRecebidas deve filtrar por vagaId quando informado")
    void gerenciarRecebidas_ComVagaId_DeveFiltrarPorVagaEContratante() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");
        c1.setAtualizadaEm(Instant.now());

        when(candidaturaRepository.findByContratanteIdAndVagaId("contratante-456", "vaga-789")).thenReturn(List.of(c1));
        when(vagaRepository.findAllById(anySet())).thenReturn(List.of(vaga));
        when(usuarioRepository.findAllById(anySet())).thenReturn(List.of(candidato));

        List<CandidaturaResponseDTO> resultado = candidaturaService.gerenciarRecebidas("contratante-456", "vaga-789");

        assertEquals(1, resultado.size());
        verify(candidaturaRepository).findByContratanteIdAndVagaId("contratante-456", "vaga-789");
    }

    @Test
    @DisplayName("gerenciarRecebidas deve buscar todas as candidaturas do contratante quando vagaId for nulo")
    void gerenciarRecebidas_SemVagaId_DeveBuscarTodasDoContratante() {
        when(candidaturaRepository.findByContratanteId("contratante-456")).thenReturn(Collections.emptyList());

        List<CandidaturaResponseDTO> resultado = candidaturaService.gerenciarRecebidas("contratante-456", null);

        assertNotNull(resultado);
        verify(candidaturaRepository).findByContratanteId("contratante-456");
    }

    // -------------------------------------------------------------
    // TESTES DE BUSCAR POR ID (GET /candidaturas/{id})
    // -------------------------------------------------------------

    @Test
    @DisplayName("buscarPorId deve lançar Forbidden se o usuário não for candidato nem contratante")
    void buscarPorId_UsuarioNaoAutorizado_DeveLancarForbidden() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.buscarPorId("c1", "outro-usuario")
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    @DisplayName("buscarPorId deve retornar DTO com sucesso se o usuário for o candidato")
    void buscarPorId_UsuarioAutorizado_DeveRetornar() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));

        CandidaturaResponseDTO dto = candidaturaService.buscarPorId("c1", "candidato-123");

        assertNotNull(dto);
        assertEquals("c1", dto.getId());
    }

    // -------------------------------------------------------------
    // TESTES DE ATUALIZAR STATUS (PATCH /candidaturas/{id}/status)
    // -------------------------------------------------------------

    @Test
    @DisplayName("atualizarStatus deve lançar BadRequest se DTO ou status for nulo")
    void atualizarStatus_StatusNulo_DeveLancarBadRequest() {
        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.atualizarStatus("c1", "contratante-456", null)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    @DisplayName("atualizarStatus deve lançar Forbidden se quem tentar alterar não for o contratante")
    void atualizarStatus_NaoContratante_DeveLancarForbidden() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setContratanteId("contratante-456");

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.atualizarStatus("c1", "outro-usuario", new StatusUpdateDTO(StatusCandidatura.EM_CHAT))
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    @DisplayName("atualizarStatus deve lançar BadRequest se tentar passar RECUSADO diretamente sem feedback")
    void atualizarStatus_TentandoRecusarSemEndpointEspecifico_DeveLancarBadRequest() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setContratanteId("contratante-456");

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.atualizarStatus("c1", "contratante-456", new StatusUpdateDTO(StatusCandidatura.RECUSADO))
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        assertTrue(ex.getMessage().contains("endpoint específico de recusa"));
    }

    @Test
    @DisplayName("atualizarStatus para EM_CHAT deve alterar status e notificar o candidato")
    void atualizarStatus_ParaEmChat_DeveSalvarENotificar() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");
        c1.setStatus(StatusCandidatura.INSCRITO);

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));
        when(candidaturaRepository.save(any(Candidatura.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(usuarioRepository.findById("contratante-456")).thenReturn(Optional.of(contratante));

        CandidaturaResponseDTO response = candidaturaService.atualizarStatus("c1", "contratante-456", new StatusUpdateDTO(StatusCandidatura.EM_CHAT));

        assertEquals(StatusCandidatura.EM_CHAT, response.getStatus());
        verify(notificacaoService).criar(
                eq("candidato-123"),
                eq("contratante-456"),
                eq("Empresa ABC"),
                eq("candidatura_chat"),
                contains("chamou você para alinhar detalhes no chat"),
                eq("vaga-789")
        );
    }

    @Test
    @DisplayName("atualizarStatus para ALINHAMENTO_FINAL deve alterar status e notificar o candidato")
    void atualizarStatus_ParaAlinhamentoFinal_DeveSalvarENotificar() {
        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");
        c1.setStatus(StatusCandidatura.EM_CHAT);

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));
        when(candidaturaRepository.save(any(Candidatura.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(usuarioRepository.findById("contratante-456")).thenReturn(Optional.of(contratante));

        CandidaturaResponseDTO response = candidaturaService.atualizarStatus("c1", "contratante-456", new StatusUpdateDTO(StatusCandidatura.ALINHAMENTO_FINAL));

        assertEquals(StatusCandidatura.ALINHAMENTO_FINAL, response.getStatus());
        verify(notificacaoService).criar(
                eq("candidato-123"),
                eq("contratante-456"),
                eq("Empresa ABC"),
                eq("candidatura_aceite"),
                contains("foi selecionada para a etapa final"),
                eq("vaga-789")
        );
    }

    // -------------------------------------------------------------
    // TESTES DE RECUSA COM FEEDBACK (POST /candidaturas/{id}/recusar)
    // -------------------------------------------------------------

    @Test
    @DisplayName("recusarComFeedback deve lançar 422 Unprocessable Entity se motivoPrincipal for nulo ou vazio")
    void recusarComFeedback_SemMotivoPrincipal_DeveLancarUnprocessableEntity() {
        FeedbackRecusaDTO dto = new FeedbackRecusaDTO();
        dto.setMotivoPrincipal("   ");

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.recusarComFeedback("c1", "contratante-456", dto)
        );

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatus());
        assertTrue(ex.getMessage().contains("motivo principal do feedback é obrigatório"));
    }

    @Test
    @DisplayName("recusarComFeedback deve lançar Forbidden se quem tentar recusar não for o contratante")
    void recusarComFeedback_NaoContratante_DeveLancarForbidden() {
        FeedbackRecusaDTO dto = new FeedbackRecusaDTO();
        dto.setMotivoPrincipal("Perfil não aderente no momento");

        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setContratanteId("contratante-456");

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));

        ApiException ex = assertThrows(ApiException.class, () ->
                candidaturaService.recusarComFeedback("c1", "outro-usuario", dto)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    @DisplayName("recusarComFeedback com sucesso deve alterar status para RECUSADO, gravar feedback e notificar candidato")
    void recusarComFeedback_ComSucesso_DeveAtualizarGravarENotificar() {
        FeedbackRecusaDTO dto = new FeedbackRecusaDTO();
        dto.setMotivoPrincipal("Outro candidato com experiência prévia em React");
        dto.setCompetenciasMelhoria(List.of("React avançado", "Testes unitários"));
        dto.setPontosFortes(List.of("Excelente portfólio", "Ótima comunicação"));
        dto.setDicaConstrutiva("Continue praticando projetos reais no GitHub!");

        Candidatura c1 = new Candidatura();
        c1.setId("c1");
        c1.setVagaId("vaga-789");
        c1.setCandidatoId("candidato-123");
        c1.setContratanteId("contratante-456");
        c1.setStatus(StatusCandidatura.INSCRITO);

        when(candidaturaRepository.findById("c1")).thenReturn(Optional.of(c1));
        when(candidaturaRepository.save(any(Candidatura.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vagaRepository.findById("vaga-789")).thenReturn(Optional.of(vaga));
        when(usuarioRepository.findById("candidato-123")).thenReturn(Optional.of(candidato));
        when(usuarioRepository.findById("contratante-456")).thenReturn(Optional.of(contratante));

        CandidaturaResponseDTO response = candidaturaService.recusarComFeedback("c1", "contratante-456", dto);

        assertEquals(StatusCandidatura.RECUSADO, response.getStatus());
        assertNotNull(response.getFeedbackSelecao());
        assertEquals("Outro candidato com experiência prévia em React", response.getFeedbackSelecao().getMotivoPrincipal());
        assertEquals(2, response.getFeedbackSelecao().getCompetenciasMelhoria().size());
        assertEquals(2, response.getFeedbackSelecao().getPontosFortes().size());
        assertEquals("Continue praticando projetos reais no GitHub!", response.getFeedbackSelecao().getDicaConstrutiva());

        verify(candidaturaRepository).save(any(Candidatura.class));
        verify(notificacaoService).criar(
                eq("candidato-123"),
                eq("contratante-456"),
                eq("Empresa ABC"),
                eq("candidatura_feedback"),
                contains("feedback construtivo"),
                eq("vaga-789")
        );
    }
}
