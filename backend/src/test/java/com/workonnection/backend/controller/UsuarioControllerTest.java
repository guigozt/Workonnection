package com.workonnection.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.GlobalExceptionHandler;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @Mock
    private UsuarioService service;

    @Mock
    private SecurityContextRepository securityContextRepository;

    @InjectMocks
    private UsuarioController controller;

    private UsuarioResponseDTO respostaPadrao;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        respostaPadrao = new UsuarioResponseDTO(
                "u1", "Paulo", "paulo@email.com", "12345678900",
                "2000-05-15", "11999999999", "ESTUDANTE", true,
                new Usuario.Perfil(), 0L, new Usuario.Configuracoes()
        );
    }

    @Test
    @DisplayName("Deve cobrir rotas públicas e autenticadas do UsuarioController")
    void rotasUsuarioController() throws Exception {
        when(service.listarColaboradores()).thenReturn(List.of(respostaPadrao));
        mockMvc.perform(get("/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("u1"));

        when(service.buscarPorId("u1")).thenReturn(respostaPadrao);
        mockMvc.perform(get("/usuarios/u1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Paulo"));

        when(service.cadastrar(any())).thenReturn(respostaPadrao);
        mockMvc.perform(post("/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Paulo\",\"email\":\"paulo@email.com\"}"))
                .andExpect(status().isCreated());

        when(service.login(any())).thenReturn(respostaPadrao);
        mockMvc.perform(post("/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"paulo@email.com\"}"))
                .andExpect(status().isOk());

        // Sem autenticação -> 401
        mockMvc.perform(get("/usuarios/me"))
                .andExpect(status().isUnauthorized());

        // Via sessão HTTP
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("usuarioId", "u1");
        mockMvc.perform(get("/usuarios/me").session(session))
                .andExpect(status().isOk());

        // Via Bearer Token: perfil, configurações, completar-cadastro, uploads, logout e exclusão
        when(service.atualizarPerfil(eq("u1"), any())).thenReturn(respostaPadrao);
        mockMvc.perform(put("/usuarios/perfil")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk());

        when(service.atualizarConfiguracoes(eq("u1"), any())).thenReturn(respostaPadrao);
        mockMvc.perform(put("/usuarios/configuracoes")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tema\":\"escuro\",\"idioma\":\"pt-BR\"}"))
                .andExpect(status().isOk());

        when(service.completarCadastro(eq("u1"), any())).thenReturn(respostaPadrao);
        mockMvc.perform(post("/usuarios/completar-cadastro")
                        .header("Authorization", "Bearer u1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Paulo\"}"))
                .andExpect(status().isOk());

        MockMultipartFile foto = new MockMultipartFile("foto", "a.png", "image/png", new byte[]{1});
        when(service.uploadFotoPerfil(eq("u1"), any())).thenReturn(respostaPadrao);
        mockMvc.perform(multipart("/usuarios/perfil/foto").file(foto).header("Authorization", "Bearer u1"))
                .andExpect(status().isOk());

        MockMultipartFile doc = new MockMultipartFile("arquivo", "d.pdf", "application/pdf", new byte[]{1});
        when(service.uploadDocumento(eq("u1"), eq("CURRICULO"), any())).thenReturn(respostaPadrao);
        mockMvc.perform(multipart("/usuarios/perfil/documentos")
                        .file(doc)
                        .param("tipoDocumento", "CURRICULO")
                        .header("Authorization", "Bearer u1"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/usuarios/logout").session(session))
                .andExpect(status().isOk());

        MockHttpSession sessionDel = new MockHttpSession();
        sessionDel.setAttribute("usuarioId", "u1");
        mockMvc.perform(delete("/usuarios/conta").session(sessionDel))
                .andExpect(status().isNoContent());
        verify(service).excluirConta("u1");
    }
}

