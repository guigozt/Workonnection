package com.workonnection.backend.service;

import com.workonnection.backend.dto.ComentarioDTO;
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.ArquivoMetadados;
import com.workonnection.backend.model.Comentario;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VagaServiceTest {

    @Mock
    private VagaRepository vagaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private VagaService vagaService;

    private Usuario empresa;
    private Usuario estudante;
    private Vaga vagaExistente;
    private String dataFutura;

    @BeforeEach
    void setUp() {
        dataFutura = LocalDate.now().plusDays(15).toString();

        empresa = new Usuario();
        empresa.setId("emp-1");
        empresa.setNome("Tech Corp");
        empresa.setTipoUsuario("Empresa");
        empresa.getPerfil().setFotoPerfil(new ArquivoMetadados("f1", "FOTO_PERFIL", "logo.png", "image/png", 100L, "https://cdn/logo.png"));

        estudante = new Usuario();
        estudante.setId("est-1");
        estudante.setNome("Ana Aluna");
        estudante.setTipoUsuario("Estudante");

        vagaExistente = new Vaga();
        vagaExistente.setId("vaga-1");
        vagaExistente.setEmpresa("Tech Corp");
        vagaExistente.setCargo("Dev Java");
        vagaExistente.setDescricao("Atuar com Spring Boot");
        vagaExistente.setRequisitos("Java 17");
        vagaExistente.setModalidade("Remoto");
        vagaExistente.setUsuarioId("emp-1");
        vagaExistente.setNomeUsuario("Tech Corp");
        vagaExistente.setTiposUsuario(List.of("Estudante"));
    }

    private VagaDTO criarVagaDTO(String data) {
        return new VagaDTO(
                "Tech Corp", "Dev Java", "Atuar com Spring Boot", "Remoto",
                "Flexível", "VR", "São Paulo", "R$ 3000", data,
                "Java 17", "rh@tech.com", List.of("Estudante")
        );
    }

    @Test
    @DisplayName("Deve publicar vaga com sucesso por empresa e bloquear publicação por estudante ou data inválida")
    void salvar_ValidacoesESucesso() {
        when(usuarioRepository.findById("est-1")).thenReturn(Optional.of(estudante));
        ApiException exForbidden = assertThrows(ApiException.class, () ->
                vagaService.salvar(criarVagaDTO(dataFutura), "est-1"));
        assertEquals(HttpStatus.FORBIDDEN, exForbidden.getStatus());

        when(usuarioRepository.findById("emp-1")).thenReturn(Optional.of(empresa));
        // Data no passado
        assertThrows(ApiException.class, () ->
                vagaService.salvar(criarVagaDTO(LocalDate.now().minusDays(2).toString()), "emp-1"));
        // Data inválida
        assertThrows(ApiException.class, () ->
                vagaService.salvar(criarVagaDTO("invalida"), "emp-1"));

        when(vagaRepository.save(any(Vaga.class))).thenAnswer(inv -> {
            Vaga v = inv.getArgument(0);
            v.setId("vaga-nova");
            return v;
        });

        VagaResponseDTO res = vagaService.salvar(criarVagaDTO(dataFutura), "emp-1");
        assertEquals("vaga-nova", res.id());
        assertEquals("https://cdn/logo.png", res.fotoCriadorUrl());
    }

    @Test
    @DisplayName("Deve editar e excluir vaga validando posse do usuário")
    void editarEExcluir() {
        when(vagaRepository.findById("vaga-1")).thenReturn(Optional.of(vagaExistente));
        when(usuarioRepository.findById("emp-1")).thenReturn(Optional.of(empresa));
        when(vagaRepository.save(any(Vaga.class))).thenAnswer(inv -> inv.getArgument(0));

        assertThrows(ApiException.class, () -> vagaService.editar("vaga-1", criarVagaDTO(dataFutura), "est-1"));
        assertThrows(ApiException.class, () -> vagaService.excluir("vaga-1", "est-1"));

        VagaResponseDTO editada = vagaService.editar("vaga-1", criarVagaDTO(dataFutura), "emp-1");
        assertEquals("Dev Java", editada.cargo());

        vagaService.excluir("vaga-1", "emp-1");
        verify(vagaRepository).deleteById("vaga-1");
    }

    @Test
    @DisplayName("Deve gerenciar likes, dislikes, comentários e exclusão de comentários")
    void interacoesLikeDislikeComentarios() {
        when(vagaRepository.findById("vaga-1")).thenReturn(Optional.of(vagaExistente));
        when(usuarioRepository.findById("est-1")).thenReturn(Optional.of(estudante));
        when(usuarioRepository.findById("emp-1")).thenReturn(Optional.of(empresa));
        when(vagaRepository.save(any(Vaga.class))).thenAnswer(inv -> inv.getArgument(0));

        // Dislike toggle
        VagaResponseDTO r1 = vagaService.dislike("vaga-1", "est-1");
        assertTrue(r1.dislikes().contains("est-1"));

        // Like remove dislike e notifica dono
        VagaResponseDTO r2 = vagaService.like("vaga-1", "est-1");
        assertTrue(r2.likes().contains("est-1"));
        assertFalse(r2.dislikes().contains("est-1"));
        verify(notificacaoService).criar(eq("emp-1"), eq("est-1"), eq("Ana Aluna"), eq("like"), anyString(), eq("vaga-1"));

        // Like novamente remove o like
        VagaResponseDTO r3 = vagaService.like("vaga-1", "est-1");
        assertFalse(r3.likes().contains("est-1"));

        // Comentário vazio -> erro
        assertThrows(ApiException.class, () -> vagaService.comentar("vaga-1", "est-1", new ComentarioDTO("  ")));

        // Comentar com sucesso
        VagaResponseDTO rCom = vagaService.comentar("vaga-1", "est-1", new ComentarioDTO("Tenho interesse!"));
        assertEquals(1, rCom.comentarios().size());
        String comentarioId = rCom.comentarios().get(0).getId();

        // Terceiro sem permissão tenta excluir comentário
        assertThrows(ApiException.class, () -> vagaService.excluirComentario("vaga-1", comentarioId, "intruso-99"));

        // Dono da vaga ou autor exclui comentário
        VagaResponseDTO rSemCom = vagaService.excluirComentario("vaga-1", comentarioId, "emp-1");
        assertTrue(rSemCom.comentarios().isEmpty());
    }

    @Test
    @DisplayName("Deve listar e filtrar vagas por busca textual, modalidade, tipo e perfil autenticado")
    void listarEFiltrar() {
        when(vagaRepository.findAll()).thenReturn(List.of(vagaExistente));
        when(usuarioRepository.findById("emp-1")).thenReturn(Optional.of(empresa));

        assertEquals(1, vagaService.listar("Spring", "Aluno", "Remoto").size());
        assertEquals(0, vagaService.listar("Python", null, null).size());
        assertEquals(0, vagaService.listar(null, null, "Presencial").size());
        assertEquals(0, vagaService.listar(null, "Professor", null).size());

        when(mongoTemplate.find(any(Query.class), eq(Vaga.class))).thenReturn(List.of(vagaExistente));
        when(usuarioRepository.findById("est-1")).thenReturn(Optional.of(estudante));

        assertEquals(1, vagaService.listarTodas().size());
        assertEquals(1, vagaService.filtrar("Java", "Estudante", "Remoto", "est-1").size());
        assertEquals(1, vagaService.filtrar("Java", "todos", "todos", "emp-1").size());

        when(vagaRepository.findByUsuarioId("emp-1")).thenReturn(List.of(vagaExistente));
        assertEquals(1, vagaService.listarPorUsuario("emp-1").size());
    }
}

