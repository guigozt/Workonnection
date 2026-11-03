package com.workonnection.backend.controller;

import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.GlobalExceptionHandler;
import com.workonnection.backend.service.VagaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class VagaControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VagaService service;

    @InjectMocks
    private VagaController controller;

    private VagaResponseDTO vagaDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        vagaDto = new VagaResponseDTO(
                "v1", "Empresa", "Tech", "Dev Java", "Desc", "Remoto",
                "Integral", "VR", "SP", "3000", "2027-01-01", "Java",
                "rh@tech.com", "emp-1", List.of("Estudante"),
                List.of(), List.of(), List.of(), null
        );
    }

    @Test
    @DisplayName("Deve cobrir todas as rotas de VagaController com Bearer Token, Sessão e 401")
    void rotasVagaController() throws Exception {
        mockMvc.perform(post("/vagas").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());

        when(service.salvar(any(), eq("emp-1"))).thenReturn(vagaDto);
        mockMvc.perform(post("/vagas")
                        .header("Authorization", "Bearer emp-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cargo\":\"Dev Java\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("v1"));

        when(service.filtrar(any(), any(), any(), any())).thenReturn(List.of(vagaDto));
        mockMvc.perform(get("/vagas").param("busca", "Java"))
                .andExpect(status().isOk());

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", "emp-1");
        when(service.listarPorUsuario("emp-1")).thenReturn(List.of(vagaDto));
        mockMvc.perform(get("/vagas/minhas").session(session))
                .andExpect(status().isOk());

        when(service.editar(eq("v1"), any(), eq("emp-1"))).thenReturn(vagaDto);
        mockMvc.perform(put("/vagas/v1")
                        .header("Authorization", "Bearer emp-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cargo\":\"Dev Java\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/vagas/v1").header("Authorization", "Bearer emp-1"))
                .andExpect(status().isNoContent());
        verify(service).excluir("v1", "emp-1");

        when(service.like("v1", "emp-1")).thenReturn(vagaDto);
        mockMvc.perform(post("/vagas/v1/like").header("Authorization", "Bearer emp-1"))
                .andExpect(status().isOk());

        when(service.dislike("v1", "emp-1")).thenReturn(vagaDto);
        mockMvc.perform(post("/vagas/v1/dislike").header("Authorization", "Bearer emp-1"))
                .andExpect(status().isOk());

        when(service.comentar(eq("v1"), eq("emp-1"), any())).thenReturn(vagaDto);
        mockMvc.perform(post("/vagas/v1/comentarios")
                        .header("Authorization", "Bearer emp-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"texto\":\"Ótima vaga\"}"))
                .andExpect(status().isOk());

        when(service.excluirComentario("v1", "c1", "emp-1")).thenReturn(vagaDto);
        mockMvc.perform(delete("/vagas/v1/comentarios/c1").header("Authorization", "Bearer emp-1"))
                .andExpect(status().isOk());
    }
}

