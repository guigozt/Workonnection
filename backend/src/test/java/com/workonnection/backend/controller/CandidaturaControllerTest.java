package com.workonnection.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workonnection.backend.dto.CandidaturaCreateDTO;
import com.workonnection.backend.dto.CandidaturaResponseDTO;
import com.workonnection.backend.dto.FeedbackRecusaDTO;
import com.workonnection.backend.dto.StatusUpdateDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.exception.GlobalExceptionHandler;
import com.workonnection.backend.model.StatusCandidatura;
import com.workonnection.backend.service.CandidaturaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CandidaturaControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private CandidaturaService candidaturaService;

    @InjectMocks
    private CandidaturaController candidaturaController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(candidaturaController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /candidaturas/vaga/{vagaId} com token válido deve retornar 201 Created")
    void candidatar_ComTokenValido_DeveRetornarCreated() throws Exception {
        CandidaturaCreateDTO dto = new CandidaturaCreateDTO("Mensagem teste");
        CandidaturaResponseDTO responseDTO = new CandidaturaResponseDTO();
        responseDTO.setId("cand-123");
        responseDTO.setVagaId("vaga-001");
        responseDTO.setStatus(StatusCandidatura.INSCRITO);

        when(candidaturaService.candidatar(eq("vaga-001"), eq("user-123"), any(CandidaturaCreateDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/candidaturas/vaga/vaga-001")
                        .header("Authorization", "Bearer user-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("cand-123"))
                .andExpect(jsonPath("$.status").value("INSCRITO"));
    }

    @Test
    @DisplayName("POST /candidaturas/vaga/{vagaId} sem token deve retornar 401 Unauthorized")
    void candidatar_SemToken_DeveRetornarUnauthorized() throws Exception {
        mockMvc.perform(post("/candidaturas/vaga/vaga-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.erro").value("Não autenticado"));
    }

    @Test
    @DisplayName("GET /candidaturas/minhas com token válido deve retornar 200 OK")
    void listarMinhas_ComTokenValido_DeveRetornarOk() throws Exception {
        CandidaturaResponseDTO c1 = new CandidaturaResponseDTO();
        c1.setId("cand-123");

        when(candidaturaService.listarMinhas("user-123")).thenReturn(List.of(c1));

        mockMvc.perform(get("/candidaturas/minhas")
                        .header("Authorization", "Bearer user-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("cand-123"));
    }

    @Test
    @DisplayName("GET /candidaturas/gerenciar com filtro vagaId deve repassar para o service")
    void gerenciarRecebidas_ComVagaId_DeveRetornarOk() throws Exception {
        when(candidaturaService.gerenciarRecebidas("contratante-999", "vaga-888")).thenReturn(List.of());

        mockMvc.perform(get("/candidaturas/gerenciar")
                        .param("vagaId", "vaga-888")
                        .header("Authorization", "Bearer contratante-999"))
                .andExpect(status().isOk());

        verify(candidaturaService).gerenciarRecebidas("contratante-999", "vaga-888");
    }

    @Test
    @DisplayName("GET /candidaturas/{id} deve retornar detalhes da candidatura")
    void buscarPorId_ComSucesso_DeveRetornarOk() throws Exception {
        CandidaturaResponseDTO dto = new CandidaturaResponseDTO();
        dto.setId("cand-123");

        when(candidaturaService.buscarPorId("cand-123", "user-123")).thenReturn(dto);

        mockMvc.perform(get("/candidaturas/cand-123")
                        .header("Authorization", "Bearer user-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("cand-123"));
    }

    @Test
    @DisplayName("PATCH /candidaturas/{id}/status deve atualizar status")
    void atualizarStatus_ComSucesso_DeveRetornarOk() throws Exception {
        StatusUpdateDTO dto = new StatusUpdateDTO(StatusCandidatura.EM_CHAT);
        CandidaturaResponseDTO response = new CandidaturaResponseDTO();
        response.setId("cand-123");
        response.setStatus(StatusCandidatura.EM_CHAT);

        when(candidaturaService.atualizarStatus(eq("cand-123"), eq("contratante-1"), any(StatusUpdateDTO.class)))
                .thenReturn(response);

        mockMvc.perform(patch("/candidaturas/cand-123/status")
                        .header("Authorization", "Bearer contratante-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("EM_CHAT"));
    }

    @Test
    @DisplayName("POST /candidaturas/{id}/recusar sem motivo principal deve retornar 422 Unprocessable Entity")
    void recusar_SemMotivoPrincipal_DeveRetornar422() throws Exception {
        FeedbackRecusaDTO dto = new FeedbackRecusaDTO();
        dto.setMotivoPrincipal("");

        when(candidaturaService.recusarComFeedback(eq("cand-123"), eq("contratante-1"), any(FeedbackRecusaDTO.class)))
                .thenThrow(new ApiException("O motivo principal do feedback é obrigatório para não selecionar o candidato.", HttpStatus.UNPROCESSABLE_ENTITY));

        mockMvc.perform(post("/candidaturas/cand-123/recusar")
                        .header("Authorization", "Bearer contratante-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.erro").value("O motivo principal do feedback é obrigatório para não selecionar o candidato."));
    }
}
