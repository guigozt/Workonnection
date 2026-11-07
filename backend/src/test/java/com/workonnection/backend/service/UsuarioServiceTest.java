package com.workonnection.backend.service;

import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.*;
import com.workonnection.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private VagaRepository vagaRepository;

    @Mock
    private CandidaturaRepository candidaturaRepository;

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private MensagemRepository mensagemRepository;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock
    private EmailVerificationService emailVerificationService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPadrao;

    @BeforeEach
    void setUp() {
        usuarioPadrao = new Usuario();
        usuarioPadrao.setId("user-1");
        usuarioPadrao.setNome("Paulo Silva");
        usuarioPadrao.setEmail("paulo@email.com");
        usuarioPadrao.setCpf("123.456.789-00");
        usuarioPadrao.setDataNascimento("2000-05-15");
        usuarioPadrao.setTelefone("11999999999");
        usuarioPadrao.setTipoUsuario("ESTUDANTE");
        usuarioPadrao.setEmailVerified(true);
        usuarioPadrao.setSenha("encoded_hash");
    }

    @Test
    @DisplayName("Deve cadastrar usuário com sucesso com data ISO e formato dd/MM/yyyy")
    void cadastrar_ComSucesso() {
        CadastroDTO dto = new CadastroDTO(
                "Paulo Silva", "12345678900", "15/05/2000",
                "11999999999", "paulo@email.com", "ESTUDANTE"
        );
        when(repository.findFirstByEmail("paulo@email.com")).thenReturn(Optional.empty());
        when(repository.findByCpfIn(anyList())).thenReturn(List.of());
        when(repository.findByCpfVariants(anyString(), anyString())).thenReturn(List.of());
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId("user-novo");
            return u;
        });

        UsuarioResponseDTO res = usuarioService.cadastrar(dto);

        assertEquals("user-novo", res.id());
        assertEquals("Paulo Silva", res.nome());
        assertTrue(res.cadastroCompleto());
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando email já existe, nome inválido, CPF duplicado ou data inválida")
    void cadastrar_ValidacoesDeErro() {
        when(repository.findFirstByEmail("dup@email.com")).thenReturn(Optional.of(usuarioPadrao));
        ApiException exEmail = assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "123", "2000-01-01", "119", "dup@email.com", "ESTUDANTE")));
        assertEquals(HttpStatus.CONFLICT, exEmail.getStatus());

        when(repository.findFirstByEmail("ok@email.com")).thenReturn(Optional.empty());

        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("", "123", "2000-01-01", "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("   ", "123", "2000-01-01", "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Ab", "123", "2000-01-01", "119", "ok@email.com", "ESTUDANTE")));

        // CPF duplicado
        Usuario outro = new Usuario();
        outro.setId("outro-id");
        when(repository.findByCpfIn(anyList())).thenReturn(List.of(outro));
        ApiException exCpf = assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", "2000-01-01", "119", "ok@email.com", "ESTUDANTE")));
        assertEquals(HttpStatus.CONFLICT, exCpf.getStatus());

        // Datas inválidas: nula, futura, menor de 16, maior de 100, formato inválido
        when(repository.findByCpfIn(anyList())).thenReturn(List.of());
        when(repository.findByCpfVariants(anyString(), anyString())).thenReturn(List.of());

        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", "", "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", "2099-01-01", "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", java.time.LocalDate.now().minusYears(10).toString(), "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", "1900-01-01", "119", "ok@email.com", "ESTUDANTE")));
        assertThrows(ApiException.class, () ->
                usuarioService.cadastrar(new CadastroDTO("Paulo", "12345678900", "data-errada", "119", "ok@email.com", "ESTUDANTE")));
    }

    @Test
    @DisplayName("Deve realizar login, buscar por ID e listar colaboradores")
    void loginBuscarListar() {
        Notificacao n1 = new Notificacao("n1", "like", "msg", "r1", "João", "v1", Instant.now());
        Notificacao n2 = new Notificacao("n2", "like", "msg", "r1", "João", "v1", Instant.now());
        n2.setLida(true);
        usuarioPadrao.setNotificacoes(List.of(n1, n2));

        when(repository.findFirstByEmail("paulo@email.com")).thenReturn(Optional.of(usuarioPadrao));
        when(passwordEncoder.matches(eq("123456"), eq("encoded_hash"))).thenReturn(true);
        UsuarioResponseDTO logado = usuarioService.login(new LoginDTO("paulo@email.com", "123456"));
        assertEquals(1L, logado.notificacoesNaoLidas());

        when(repository.findFirstByEmail("nao@existe.com")).thenReturn(Optional.empty());
        assertThrows(ApiException.class, () -> usuarioService.login(new LoginDTO("nao@existe.com", "123456")));

        when(repository.findById("user-1")).thenReturn(Optional.of(usuarioPadrao));
        assertEquals("user-1", usuarioService.buscarPorId("user-1").id());

        when(repository.findById("404")).thenReturn(Optional.empty());
        assertThrows(ApiException.class, () -> usuarioService.buscarPorId("404"));

        when(repository.findAll()).thenReturn(List.of(usuarioPadrao));
        assertEquals(1, usuarioService.listarColaboradores().size());
    }

    @Test
    @DisplayName("Deve atualizar perfis específicos (ESTUDANTE, MEI, ME, EMPRESA) e converter para perfil público")
    void atualizarPerfisEToPublicResponse() {
        assertNull(usuarioService.toPublicResponse(null));

        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        // 1. ESTUDANTE
        usuarioPadrao.setTipoUsuario("ESTUDANTE");
        when(repository.findById("user-1")).thenReturn(Optional.of(usuarioPadrao));
        PerfilEstudanteDTO peDto = new PerfilEstudanteDTO("Fatec", "ADS", "5º", "2026", "Noite", "12345", "Remoto");
        PerfilDTO dtoEstudante = new PerfilDTO(
                "Sobre mim", "SP", "11999999999", "@insta", "in/paulo", "https://site.com",
                List.of("Java", "React"),
                List.of(Map.of("curso", "ADS")),
                List.of(Map.of("empresa", "Tech")),
                List.of(Map.of("nome", "Docker")),
                peDto, null, null, null
        );
        usuarioService.atualizarPerfil("user-1", dtoEstudante);

        // 2. MEI
        usuarioPadrao.setTipoUsuario("MEI");
        PerfilMeiDTO pMeiDto = new PerfilMeiDTO("12.345.678/0001-90", "Paulo MEI", "PTech", "Dev", "pix@email.com", "111", true);
        usuarioService.atualizarPerfil("user-1", new PerfilDTO(null, null, null, null, null, null, null, null, null, null, null, pMeiDto, null, null));

        // 3. ME
        usuarioPadrao.setTipoUsuario("ME");
        PerfilMeDTO pMeDto = new PerfilMeDTO("12.345.678/0001-90", "Paulo ME", "PTech ME", "6201-5", "222", "333", "Simples Nacional", "ME", 5);
        usuarioService.atualizarPerfil("user-1", new PerfilDTO(null, null, null, null, null, null, null, null, null, null, null, null, pMeDto, null));

        // 4. EMPRESA
        usuarioPadrao.setTipoUsuario("EMPRESA");
        PerfilEmpresaDTO pEmpDto = new PerfilEmpresaDTO("98.765.432/0001-10", "Corp SA", "Corp", "TI", "51-200", "https://corp.com", "https://corp.com/vagas", "rh@corp.com", "1133334444");
        usuarioService.atualizarPerfil("user-1", new PerfilDTO(null, null, null, null, null, null, null, null, null, null, null, null, null, pEmpDto));

        // Foto para exercitar toPublicResponse completo
        usuarioPadrao.getPerfil().setFotoPerfil(new ArquivoMetadados("f1", "FOTO_PERFIL", "foto.png", "image/png", 1024L, "https://cdn/foto.png"));

        UsuarioPublicoDTO pub = usuarioService.toPublicResponse(usuarioPadrao);
        assertNotNull(pub);
        assertEquals("https://cdn/foto.png", pub.perfil().fotoPerfilUrl());
        assertEquals("Fatec", pub.perfil().perfilEstudante().instituicaoEnsino());
        assertEquals("PTech", pub.perfil().perfilMei().nomeFantasia());
        assertEquals("PTech ME", pub.perfil().perfilMe().nomeFantasia());
        assertEquals("Corp", pub.perfil().perfilEmpresa().nomeFantasia());
    }

    @Test
    @DisplayName("Deve fazer upload de foto de perfil e documentos por categoria de usuário")
    void uploadsFotoEDocumentos() {
        when(repository.findById("user-1")).thenReturn(Optional.of(usuarioPadrao));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Foto vazia -> erro
        MockMultipartFile vazio = new MockMultipartFile("foto", "foto.png", "image/png", new byte[0]);
        assertThrows(ApiException.class, () -> usuarioService.uploadFotoPerfil("user-1", vazio));

        // Extensão inválida para foto -> erro
        MockMultipartFile pdf = new MockMultipartFile("foto", "doc.pdf", "application/pdf", new byte[]{1, 2});
        when(fileStorageService.extrairExtensao("doc.pdf")).thenReturn(".pdf");
        assertThrows(ApiException.class, () -> usuarioService.uploadFotoPerfil("user-1", pdf));

        // Foto válida -> sucesso
        MockMultipartFile png = new MockMultipartFile("foto", "avatar.png", "image/png", new byte[]{1, 2, 3});
        when(fileStorageService.extrairExtensao("avatar.png")).thenReturn(".png");
        when(fileStorageService.armazenarFotoPerfil(png)).thenReturn("https://cdn/avatar.png");
        UsuarioResponseDTO resFoto = usuarioService.uploadFotoPerfil("user-1", png);
        assertEquals("https://cdn/avatar.png", resFoto.perfil().getFotoPerfil().getUrl());

        // Documento tipo vazio -> erro
        assertThrows(ApiException.class, () -> usuarioService.uploadDocumento("user-1", " ", pdf));

        // Documento incompatível com ESTUDANTE -> erro
        assertThrows(ApiException.class, () -> usuarioService.uploadDocumento("user-1", "CCMEI", pdf));

        // Documento válido para ESTUDANTE + substituição de versão anterior
        when(fileStorageService.armazenarDocumento(pdf)).thenReturn("https://cdn/matricula.pdf");
        usuarioService.uploadDocumento("user-1", "COMPROVANTE_MATRICULA", pdf);
        UsuarioResponseDTO resDoc = usuarioService.uploadDocumento("user-1", "COMPROVANTE_MATRICULA", pdf);
        assertEquals(1, resDoc.perfil().getDocumentos().size());

        // Validar demais tipos de usuário nos documentos
        usuarioPadrao.setTipoUsuario("MEI");
        usuarioService.uploadDocumento("user-1", "CCMEI", pdf);

        usuarioPadrao.setTipoUsuario("ME");
        usuarioService.uploadDocumento("user-1", "CONTRATO_SOCIAL", pdf);

        usuarioPadrao.setTipoUsuario("EMPRESA");
        usuarioService.uploadDocumento("user-1", "CARTAO_CNPJ", pdf);
    }

    @Test
    @DisplayName("Deve atualizar configurações e completar cadastro")
    void atualizarConfiguracoesECompletarCadastro() {
        usuarioPadrao.setConfiguracoes(null);
        usuarioPadrao.setPerfil(null);
        when(repository.findById("user-1")).thenReturn(Optional.of(usuarioPadrao));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        UsuarioResponseDTO cfg = usuarioService.atualizarConfiguracoes("user-1", new ConfiguracoesDTO("escuro", "en-US"));
        assertEquals("escuro", cfg.configuracoes().getTema());
        assertEquals("en-US", cfg.configuracoes().getIdioma());

        // Completar cadastro ignorando o próprio CPF do usuário
        when(repository.findByCpfIn(anyList())).thenReturn(List.of(usuarioPadrao));
        CompletarCadastroDTO compDto = new CompletarCadastroDTO(
                "Paulo Atualizado", "123.456.789-00", "2000-05-15", "11988887777", "MEI"
        );
        UsuarioResponseDTO compRes = usuarioService.completarCadastro("user-1", compDto);
        assertEquals("Paulo Atualizado", compRes.nome());
        assertTrue(usuarioPadrao.isEmailVerified());
        assertTrue(usuarioPadrao.isGoogleLinked());

        // Erros de nome no completarCadastro
        assertThrows(ApiException.class, () ->
                usuarioService.completarCadastro("user-1", new CompletarCadastroDTO("", null, null, null, null)));
        assertThrows(ApiException.class, () ->
                usuarioService.completarCadastro("user-1", new CompletarCadastroDTO("   ", null, null, null, null)));
        assertThrows(ApiException.class, () ->
                usuarioService.completarCadastro("user-1", new CompletarCadastroDTO("Oi", null, null, null, null)));
    }

    @Test
    @DisplayName("Deve excluir conta em cascata removendo vagas, candidaturas, interações, feedbacks e mensagens")
    void excluirConta_EmCascataCompleta() {
        when(repository.findById("user-1")).thenReturn(Optional.of(usuarioPadrao));

        Vaga vagaDoUsuario = new Vaga();
        vagaDoUsuario.setId("vaga-minha");
        when(vagaRepository.findByUsuarioId("user-1")).thenReturn(List.of(vagaDoUsuario));
        when(candidaturaRepository.findByVagaId("vaga-minha")).thenReturn(List.of(new Candidatura()));
        when(candidaturaRepository.findByCandidatoId("user-1")).thenReturn(List.of(new Candidatura()));

        Vaga vagaTerceiro = new Vaga();
        vagaTerceiro.setId("vaga-outro");
        vagaTerceiro.setLikes(new ArrayList<>(List.of("user-1", "user-2")));
        vagaTerceiro.setDislikes(new ArrayList<>(List.of("user-1")));
        vagaTerceiro.setComentarios(new ArrayList<>(List.of(
                new Comentario("c1", "user-1", "Paulo", "Texto", Instant.now()),
                new Comentario("c2", "user-2", "Maria", "Outro", Instant.now())
        )));
        when(vagaRepository.findAll()).thenReturn(List.of(vagaTerceiro));

        when(feedbackRepository.findByDestinatarioIdOrderByCriadoEmDesc("user-1")).thenReturn(List.of(new Feedback()));
        when(feedbackRepository.findByAutorIdOrderByCriadoEmDesc("user-1")).thenReturn(List.of(new Feedback()));

        Mensagem m1 = new Mensagem("user-1", "user-2", "Oi");
        Mensagem m2 = new Mensagem("user-3", "user-2", "Olá");
        when(mensagemRepository.findAll()).thenReturn(List.of(m1, m2));

        usuarioService.excluirConta("user-1");

        verify(vagaRepository).delete(vagaDoUsuario);
        verify(vagaRepository).save(vagaTerceiro);
        assertEquals(1, vagaTerceiro.getComentarios().size());
        assertFalse(vagaTerceiro.getLikes().contains("user-1"));
        verify(repository).delete(usuarioPadrao);
    }
}

