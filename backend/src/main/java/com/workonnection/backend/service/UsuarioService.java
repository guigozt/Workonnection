package com.workonnection.backend.service;

import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.*;
import com.workonnection.backend.repository.CandidaturaRepository;
import com.workonnection.backend.repository.FeedbackRepository;
import com.workonnection.backend.repository.MensagemRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class UsuarioService {
    
    private final UsuarioRepository repository;
    private final FileStorageService fileStorageService;
    private final VagaRepository vagaRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final FeedbackRepository feedbackRepository;
    private final MensagemRepository mensagemRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public UsuarioService(
            UsuarioRepository repository,
            FileStorageService fileStorageService,
            VagaRepository vagaRepository,
            CandidaturaRepository candidaturaRepository,
            FeedbackRepository feedbackRepository,
            MensagemRepository mensagemRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationService emailVerificationService
    ) {
        this.repository = repository;
        this.fileStorageService = fileStorageService;
        this.vagaRepository = vagaRepository;
        this.candidaturaRepository = candidaturaRepository;
        this.feedbackRepository = feedbackRepository;
        this.mensagemRepository = mensagemRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
    }

    public UsuarioResponseDTO cadastrar(CadastroDTO dto) {
        if (repository.findFirstByEmail(dto.email()).isPresent()) {
            throw new ApiException(
                    "Email já cadastrado",
                    HttpStatus.CONFLICT
            );
        }

        if (dto.nome() == null || dto.nome().isEmpty()) {
            throw new ApiException("Nome inválido (vazio)", HttpStatus.BAD_REQUEST);
        } else if (dto.nome().trim().isEmpty()) {
            throw new ApiException("Nome inválido (em branco)", HttpStatus.BAD_REQUEST);
        } else if (dto.nome().trim().length() < 3) {
            throw new ApiException("Mínimo 3 caracteres", HttpStatus.BAD_REQUEST);
        }

        validarCpfUnico(dto.cpf(), null);
        validarDataNascimento(dto.dataNascimento());

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setCpf(dto.cpf());
        usuario.setDataNascimento(dto.dataNascimento());
        usuario.setTelefone(dto.telefone());
        usuario.setEmail(dto.email());
        usuario.setTipoUsuario(dto.tipoUsuario());

        if (dto.senha() != null && !dto.senha().isBlank()) {
            if (dto.senha().trim().length() < 6) {
                throw new ApiException("A senha deve ter no mínimo 6 caracteres", HttpStatus.BAD_REQUEST);
            }
            usuario.setSenha(passwordEncoder.encode(dto.senha().trim()));
        }

        usuario.setEmailVerified(false);
        try {
            emailVerificationService.generateAndSendCode(usuario);
        } catch (Exception e) {
            System.err.println("Aviso: Falha ao enviar e-mail de verificação: " + e.getMessage());
        }

        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO login(LoginDTO dto) {
        if (dto.email() == null || dto.email().isBlank()) {
            throw new ApiException("E-mail é obrigatório", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = repository.findFirstByEmail(dto.email().trim())
                .orElseThrow(() -> new ApiException(
                        "Credenciais inválidas",
                        HttpStatus.UNAUTHORIZED
                ));

        // Se o usuário já existe mas ainda não possui senha cadastrada (conta criada antigamente ou via Google)
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            try {
                emailVerificationService.generateAndSendCode(usuario);
                repository.save(usuario);
            } catch (Exception e) {
                System.err.println("Aviso: Falha ao enviar código para conta sem senha: " + e.getMessage());
            }
            throw new ApiException("Esta conta ainda não possui senha definida. Enviamos um código para seu e-mail para validar sua identidade e cadastrar sua senha.", HttpStatus.PRECONDITION_REQUIRED);
        }

        if (dto.senha() != null && !dto.senha().isBlank()) {
            if (!passwordEncoder.matches(dto.senha().trim(), usuario.getSenha())) {
                throw new ApiException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);
            }
        } else {
            throw new ApiException("Senha é obrigatória", HttpStatus.BAD_REQUEST);
        }

        if (!usuario.isEmailVerified() && !usuario.isGoogleLinked()) {
            throw new ApiException("E-mail não verificado. Por favor, confirme seu código de verificação.", HttpStatus.FORBIDDEN);
        }

        return toResponse(usuario);
    }

    public UsuarioResponseDTO verificarCodigoEmail(VerificarCodigoDTO dto) {
        if (dto.email() == null || dto.email().isBlank() || dto.codigo() == null || dto.codigo().isBlank()) {
            throw new ApiException("E-mail e código são obrigatórios", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = repository.findFirstByEmail(dto.email().trim())
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        if (usuario.getVerificationCode() == null || !usuario.getVerificationCode().equals(dto.codigo().trim())) {
            throw new ApiException("Código de verificação incorreto ou inválido", HttpStatus.BAD_REQUEST);
        }

        if (usuario.getVerificationExpiry() != null && usuario.getVerificationExpiry().isBefore(java.time.Instant.now())) {
            throw new ApiException("Código de verificação expirado. Solicite um novo código.", HttpStatus.BAD_REQUEST);
        }

        if (dto.novaSenha() != null && !dto.novaSenha().isBlank()) {
            if (dto.novaSenha().trim().length() < 6) {
                throw new ApiException("A senha deve ter no mínimo 6 caracteres", HttpStatus.BAD_REQUEST);
            }
            usuario.setSenha(passwordEncoder.encode(dto.novaSenha().trim()));
        }

        usuario.setEmailVerified(true);
        usuario.setVerificationCode(null);
        usuario.setVerificationExpiry(null);

        return toResponse(repository.save(usuario));
    }

    public void reenviarCodigoEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ApiException("E-mail é obrigatório", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = repository.findFirstByEmail(email.trim())
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        emailVerificationService.generateAndSendCode(usuario);
        repository.save(usuario);
    }

    public UsuarioResponseDTO buscarPorId(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Usuário não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        return toResponse(usuario);
    }

    public List<UsuarioResponseDTO> listarColaboradores() {
        return repository.findAll().stream()
                .filter(u -> u != null)
                .map(this::toResponse)
                .toList();
    }

    public UsuarioPublicoDTO toPublicResponse(Usuario u) {
        if (u == null) return null;

        Usuario.Perfil perfil = u.getPerfil() != null ? u.getPerfil() : new Usuario.Perfil();

        String fotoUrl = perfil.getFotoPerfil() != null ? perfil.getFotoPerfil().getUrl() : null;

        PerfilEstudanteDTO peDto = null;
        if (perfil.getPerfilEstudante() != null) {
            var pe = perfil.getPerfilEstudante();
            peDto = new PerfilEstudanteDTO(
                    pe.getInstituicaoEnsino(),
                    pe.getCurso(),
                    pe.getSemestreAno(),
                    pe.getPrevisaoConclusao(),
                    pe.getTurno(),
                    pe.getMatricula(),
                    pe.getModalidadeInteresse()
            );
        }

        PerfilMeiDTO pMeiDto = null;
        if (perfil.getPerfilMei() != null) {
            var pMei = perfil.getPerfilMei();
            pMeiDto = new PerfilMeiDTO(
                    pMei.getCnpj(),
                    pMei.getRazaoSocial(),
                    pMei.getNomeFantasia(),
                    pMei.getOcupacaoPrincipal(),
                    pMei.getChavePix(),
                    pMei.getInscricaoMunicipal(),
                    pMei.getEmiteNotaFiscal()
            );
        }

        PerfilMeDTO pMeDto = null;
        if (perfil.getPerfilMe() != null) {
            var pMe = perfil.getPerfilMe();
            pMeDto = new PerfilMeDTO(
                    pMe.getCnpj(),
                    pMe.getRazaoSocial(),
                    pMe.getNomeFantasia(),
                    pMe.getCnaePrincipal(),
                    pMe.getInscricaoEstadual(),
                    pMe.getInscricaoMunicipal(),
                    pMe.getRegimeTributario(),
                    pMe.getPorteEmpresa(),
                    pMe.getQuantidadeFuncionarios()
            );
        }

        PerfilEmpresaDTO pEmpDto = null;
        if (perfil.getPerfilEmpresa() != null) {
            var pEmp = perfil.getPerfilEmpresa();
            pEmpDto = new PerfilEmpresaDTO(
                    pEmp.getCnpj(),
                    pEmp.getRazaoSocial(),
                    pEmp.getNomeFantasia(),
                    pEmp.getSetorAtuacao(),
                    pEmp.getTamanhoEmpresa(),
                    pEmp.getSiteOficial(),
                    pEmp.getPaginaCarreiras(),
                    pEmp.getContatoRhEmail(),
                    pEmp.getContatoRhTelefone()
            );
        }

        PerfilPublicoDTO perfilPublico = new PerfilPublicoDTO(
                perfil.getSobre(),
                perfil.getLocal(),
                perfil.getInstagram(),
                perfil.getLinkedin(),
                perfil.getSite(),
                perfil.getHabilidades(),
                perfil.getFormacoes(),
                perfil.getExperiencias(),
                perfil.getCursos(),
                fotoUrl,
                peDto,
                pMeiDto,
                pMeDto,
                pEmpDto
        );

        return new UsuarioPublicoDTO(
                u.getId(),
                u.getNome(),
                u.getTipoUsuario(),
                perfilPublico
        );
    }

    public UsuarioResponseDTO atualizarPerfil(String id, PerfilDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Usuário não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        Usuario.Perfil perfil = usuario.getPerfil() != null ? usuario.getPerfil() : new Usuario.Perfil();

        if (dto.sobre() != null) perfil.setSobre(dto.sobre());
        if (dto.local() != null) perfil.setLocal(dto.local());
        if (dto.telefone() != null) perfil.setTelefone(dto.telefone());
        if (dto.instagram() != null) perfil.setInstagram(dto.instagram());
        if (dto.linkedin() != null) perfil.setLinkedin(dto.linkedin());
        if (dto.site() != null) perfil.setSite(dto.site());
        if (dto.habilidades() != null) perfil.setHabilidades(dto.habilidades());

        if (dto.formacoes() != null) {
            perfil.setFormacoes(
                    dto.formacoes().stream()
                            .map(o -> (java.util.Map<String, Object>) o)
                            .toList()
            );
        }

        if (dto.experiencias() != null) {
            perfil.setExperiencias(
                    dto.experiencias().stream()
                            .map(o -> (java.util.Map<String, Object>) o)
                            .toList()
            );
        }

        if (dto.cursos() != null) {
            perfil.setCursos(
                    dto.cursos().stream()
                            .map(o -> (java.util.Map<String, Object>) o)
                            .toList()
            );
        }

        // Mapeamento específico conforme o tipo de usuário
        String tipo = usuario.getTipoUsuario() != null ? usuario.getTipoUsuario().toUpperCase() : "";

        if ("ESTUDANTE".equals(tipo) && dto.perfilEstudante() != null) {
            PerfilEstudante pe = perfil.getPerfilEstudante() != null ? perfil.getPerfilEstudante() : new PerfilEstudante();
            var peDto = dto.perfilEstudante();
            if (peDto.instituicaoEnsino() != null) pe.setInstituicaoEnsino(peDto.instituicaoEnsino());
            if (peDto.curso() != null) pe.setCurso(peDto.curso());
            if (peDto.semestreAno() != null) pe.setSemestreAno(peDto.semestreAno());
            if (peDto.previsaoConclusao() != null) pe.setPrevisaoConclusao(peDto.previsaoConclusao());
            if (peDto.turno() != null) pe.setTurno(peDto.turno());
            if (peDto.matricula() != null) pe.setMatricula(peDto.matricula());
            if (peDto.modalidadeInteresse() != null) pe.setModalidadeInteresse(peDto.modalidadeInteresse());
            perfil.setPerfilEstudante(pe);
        } else if ("MEI".equals(tipo) && dto.perfilMei() != null) {
            PerfilMei pMei = perfil.getPerfilMei() != null ? perfil.getPerfilMei() : new PerfilMei();
            var pMeiDto = dto.perfilMei();
            if (pMeiDto.cnpj() != null) pMei.setCnpj(pMeiDto.cnpj());
            if (pMeiDto.razaoSocial() != null) pMei.setRazaoSocial(pMeiDto.razaoSocial());
            if (pMeiDto.nomeFantasia() != null) pMei.setNomeFantasia(pMeiDto.nomeFantasia());
            if (pMeiDto.ocupacaoPrincipal() != null) pMei.setOcupacaoPrincipal(pMeiDto.ocupacaoPrincipal());
            if (pMeiDto.chavePix() != null) pMei.setChavePix(pMeiDto.chavePix());
            if (pMeiDto.inscricaoMunicipal() != null) pMei.setInscricaoMunicipal(pMeiDto.inscricaoMunicipal());
            if (pMeiDto.emiteNotaFiscal() != null) pMei.setEmiteNotaFiscal(pMeiDto.emiteNotaFiscal());
            perfil.setPerfilMei(pMei);
        } else if ("ME".equals(tipo) && dto.perfilMe() != null) {
            PerfilMe pMe = perfil.getPerfilMe() != null ? perfil.getPerfilMe() : new PerfilMe();
            var pMeDto = dto.perfilMe();
            if (pMeDto.cnpj() != null) pMe.setCnpj(pMeDto.cnpj());
            if (pMeDto.razaoSocial() != null) pMe.setRazaoSocial(pMeDto.razaoSocial());
            if (pMeDto.nomeFantasia() != null) pMe.setNomeFantasia(pMeDto.nomeFantasia());
            if (pMeDto.cnaePrincipal() != null) pMe.setCnaePrincipal(pMeDto.cnaePrincipal());
            if (pMeDto.inscricaoEstadual() != null) pMe.setInscricaoEstadual(pMeDto.inscricaoEstadual());
            if (pMeDto.inscricaoMunicipal() != null) pMe.setInscricaoMunicipal(pMeDto.inscricaoMunicipal());
            if (pMeDto.regimeTributario() != null) pMe.setRegimeTributario(pMeDto.regimeTributario());
            if (pMeDto.porteEmpresa() != null) pMe.setPorteEmpresa(pMeDto.porteEmpresa());
            if (pMeDto.quantidadeFuncionarios() != null) pMe.setQuantidadeFuncionarios(pMeDto.quantidadeFuncionarios());
            perfil.setPerfilMe(pMe);
        } else if ("EMPRESA".equals(tipo) && dto.perfilEmpresa() != null) {
            PerfilEmpresa pEmp = perfil.getPerfilEmpresa() != null ? perfil.getPerfilEmpresa() : new PerfilEmpresa();
            var pEmpDto = dto.perfilEmpresa();
            if (pEmpDto.cnpj() != null) pEmp.setCnpj(pEmpDto.cnpj());
            if (pEmpDto.razaoSocial() != null) pEmp.setRazaoSocial(pEmpDto.razaoSocial());
            if (pEmpDto.nomeFantasia() != null) pEmp.setNomeFantasia(pEmpDto.nomeFantasia());
            if (pEmpDto.setorAtuacao() != null) pEmp.setSetorAtuacao(pEmpDto.setorAtuacao());
            if (pEmpDto.tamanhoEmpresa() != null) pEmp.setTamanhoEmpresa(pEmpDto.tamanhoEmpresa());
            if (pEmpDto.siteOficial() != null) pEmp.setSiteOficial(pEmpDto.siteOficial());
            if (pEmpDto.paginaCarreiras() != null) pEmp.setPaginaCarreiras(pEmpDto.paginaCarreiras());
            if (pEmpDto.contatoRhEmail() != null) pEmp.setContatoRhEmail(pEmpDto.contatoRhEmail());
            if (pEmpDto.contatoRhTelefone() != null) pEmp.setContatoRhTelefone(pEmpDto.contatoRhTelefone());
            perfil.setPerfilEmpresa(pEmp);
        }

        usuario.setPerfil(perfil);
        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO uploadFotoPerfil(String id, org.springframework.web.multipart.MultipartFile arquivo) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ApiException("Arquivo de foto não fornecido", HttpStatus.BAD_REQUEST);
        }

        String extensao = fileStorageService.extrairExtensao(arquivo.getOriginalFilename()).toLowerCase();
        if (!List.of(".png", ".jpg", ".jpeg").contains(extensao)) {
            throw new ApiException("A foto de perfil deve ser uma imagem (PNG, JPG ou JPEG)", HttpStatus.BAD_REQUEST);
        }

        String url = fileStorageService.armazenarFotoPerfil(arquivo);

        Usuario.Perfil perfil = usuario.getPerfil() != null ? usuario.getPerfil() : new Usuario.Perfil();
        ArquivoMetadados fotoMeta = new ArquivoMetadados(
                java.util.UUID.randomUUID().toString(),
                "FOTO_PERFIL",
                arquivo.getOriginalFilename(),
                arquivo.getContentType(),
                arquivo.getSize(),
                url
        );
        perfil.setFotoPerfil(fotoMeta);
        usuario.setPerfil(perfil);

        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO uploadDocumento(String id, String tipoDocumento, org.springframework.web.multipart.MultipartFile arquivo) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        if (tipoDocumento == null || tipoDocumento.isBlank()) {
            throw new ApiException("O tipo do documento é obrigatório (ex: COMPROVANTE_MATRICULA, CCMEI, CARTAO_CNPJ)", HttpStatus.BAD_REQUEST);
        }

        validarDocumentoPorTipoUsuario(usuario.getTipoUsuario(), tipoDocumento.toUpperCase().trim());

        String url = fileStorageService.armazenarDocumento(arquivo);

        Usuario.Perfil perfil = usuario.getPerfil() != null ? usuario.getPerfil() : new Usuario.Perfil();
        if (perfil.getDocumentos() == null) {
            perfil.setDocumentos(new java.util.ArrayList<>());
        }

        // Remove versão anterior do mesmo tipo se já existir para substituir pelo mais recente
        perfil.getDocumentos().removeIf(doc -> tipoDocumento.equalsIgnoreCase(doc.getTipoDocumento()));

        ArquivoMetadados docMeta = new ArquivoMetadados(
                java.util.UUID.randomUUID().toString(),
                tipoDocumento.toUpperCase().trim(),
                arquivo.getOriginalFilename(),
                arquivo.getContentType(),
                arquivo.getSize(),
                url
        );
        perfil.getDocumentos().add(docMeta);
        usuario.setPerfil(perfil);

        return toResponse(repository.save(usuario));
    }

    private void validarDocumentoPorTipoUsuario(String tipoUsuario, String tipoDocumento) {
        String tipo = tipoUsuario != null ? tipoUsuario.toUpperCase() : "";

        List<String> permitidosEstudante = List.of("COMPROVANTE_MATRICULA", "HISTORICO_ESCOLAR", "CURRICULO", "DOCUMENTO_IDENTIDADE");
        List<String> permitidosMei = List.of("CCMEI", "CARTAO_CNPJ", "DOCUMENTO_TITULAR");
        List<String> permitidosMe = List.of("CARTAO_CNPJ", "CONTRATO_SOCIAL", "CERTIDAO_NEGATIVA_DEBITOS", "DOC_REPRESENTANTE_LEGAL");
        List<String> permitidosEmpresa = List.of("CARTAO_CNPJ", "COMPROVANTE_ENDERECO_COMERCIAL", "PROCURACAO_OU_ESTATUTO");

        boolean valido = switch (tipo) {
            case "ESTUDANTE" -> permitidosEstudante.contains(tipoDocumento);
            case "MEI" -> permitidosMei.contains(tipoDocumento);
            case "ME" -> permitidosMe.contains(tipoDocumento);
            case "EMPRESA" -> permitidosEmpresa.contains(tipoDocumento);
            default -> true;
        };

        if (!valido) {
            throw new ApiException("Documento '" + tipoDocumento + "' não é aplicável ao tipo de usuário: " + tipo, HttpStatus.BAD_REQUEST);
        }
    }

    public UsuarioResponseDTO atualizarConfiguracoes(
            String id,
            ConfiguracoesDTO dto
    ) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Usuário não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        Usuario.Configuracoes config =
                usuario.getConfiguracoes() != null
                        ? usuario.getConfiguracoes()
                        : new Usuario.Configuracoes();

        if (dto.tema() != null) {
            config.setTema(dto.tema());
        }

        if (dto.idioma() != null) {
            config.setIdioma(dto.idioma());
        }

        usuario.setConfiguracoes(config);

        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO completarCadastro(String id, CompletarCadastroDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Usuário não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        if (dto.nome() != null) {
            if (dto.nome().isEmpty()) {
                throw new ApiException("Nome inválido (vazio)", HttpStatus.BAD_REQUEST);
            } else if (dto.nome().trim().isEmpty()) {
                throw new ApiException("Nome inválido (em branco)", HttpStatus.BAD_REQUEST);
            } else if (dto.nome().trim().length() < 3) {
                throw new ApiException("Mínimo 3 caracteres", HttpStatus.BAD_REQUEST);
            }
            usuario.setNome(dto.nome().trim());
        }
        if (dto.cpf() != null && !dto.cpf().isBlank()) {
            validarCpfUnico(dto.cpf(), usuario.getId());
            usuario.setCpf(dto.cpf().trim());
        }
        if (dto.dataNascimento() != null && !dto.dataNascimento().isBlank()) {
            validarDataNascimento(dto.dataNascimento());
            usuario.setDataNascimento(dto.dataNascimento().trim());
        }
        if (dto.telefone() != null) {
            usuario.setTelefone(dto.telefone().trim());
        }
        if (dto.tipoUsuario() != null && !dto.tipoUsuario().isBlank()) {
            usuario.setTipoUsuario(dto.tipoUsuario().trim());
        }

        if (usuario.getPerfil() == null) {
            usuario.setPerfil(new Usuario.Perfil());
        }
        usuario.getPerfil().setTelefone(usuario.getTelefone());

        if (usuario.getConfiguracoes() == null) {
            usuario.setConfiguracoes(new Usuario.Configuracoes());
        }

        usuario.setEmailVerified(true);
        usuario.setGoogleLinked(true);

        return toResponse(repository.save(usuario));
    }

    @Transactional
    public void excluirConta(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "Usuário não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        // 1. Vagas do usuário e candidaturas associadas a essas vagas
        List<Vaga> vagasDoUsuario = vagaRepository.findByUsuarioId(id);
        for (Vaga vaga : vagasDoUsuario) {
            if (vaga.getId() != null) {
                List<Candidatura> candidaturasDaVaga = candidaturaRepository.findByVagaId(vaga.getId());
                candidaturaRepository.deleteAll(candidaturasDaVaga);
                vagaRepository.delete(vaga);
            }
        }

        // 2. Candidaturas enviadas pelo usuário
        List<Candidatura> candidaturasDoUsuario = candidaturaRepository.findByCandidatoId(id);
        candidaturaRepository.deleteAll(candidaturasDoUsuario);

        // 3. Comentários, likes e dislikes feitos pelo usuário em vagas de outras pessoas
        List<Vaga> todasAsVagas = vagaRepository.findAll();
        for (Vaga vaga : todasAsVagas) {
            boolean alterado = false;

            if (vaga.getLikes() != null && vaga.getLikes().remove(id)) {
                alterado = true;
            }
            if (vaga.getDislikes() != null && vaga.getDislikes().remove(id)) {
                alterado = true;
            }
            if (vaga.getComentarios() != null) {
                int tamanhoOriginal = vaga.getComentarios().size();
                vaga.getComentarios().removeIf(c -> id.equals(c.getUsuarioId()));
                if (vaga.getComentarios().size() != tamanhoOriginal) {
                    alterado = true;
                }
            }

            if (alterado) {
                vagaRepository.save(vaga);
            }
        }

        // 4. Feedbacks onde o usuário é autor ou destinatário
        List<Feedback> feedbacksDestinatario = feedbackRepository.findByDestinatarioIdOrderByCriadoEmDesc(id);
        feedbackRepository.deleteAll(feedbacksDestinatario);

        List<Feedback> feedbacksAutor = feedbackRepository.findByAutorIdOrderByCriadoEmDesc(id);
        feedbackRepository.deleteAll(feedbacksAutor);

        // 5. Mensagens do chat enviadas ou recebidas pelo usuário
        List<Mensagem> todasMensagens = mensagemRepository.findAll();
        List<Mensagem> mensagensDoUsuario = todasMensagens.stream()
                .filter(m -> id.equals(m.getRemetenteId()) || id.equals(m.getDestinatarioId()))
                .toList();
        mensagemRepository.deleteAll(mensagensDoUsuario);

        // 6. Exclui o próprio usuário
        repository.delete(usuario);
    }

    private UsuarioResponseDTO toResponse(Usuario u) {
        long naoLidas = (u.getNotificacoes() == null)
                ? 0
                : u.getNotificacoes()
                        .stream()
                        .filter(n -> !n.isLida())
                        .count();

        Usuario.Perfil perfil =
                u.getPerfil() != null
                        ? u.getPerfil()
                        : new Usuario.Perfil();

        if (perfil.getTelefone() == null || perfil.getTelefone().isEmpty()) {
            perfil.setTelefone(u.getTelefone());
        }

        Usuario.Configuracoes config =
                u.getConfiguracoes() != null
                        ? u.getConfiguracoes()
                        : new Usuario.Configuracoes();

        boolean cadastroCompleto = u.getCpf() != null && !u.getCpf().isBlank()
                && u.getTelefone() != null && !u.getTelefone().isBlank();

        return new UsuarioResponseDTO(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getCpf(),
                u.getDataNascimento(),
                u.getTelefone(),
                u.getTipoUsuario(),
                cadastroCompleto,
                perfil,
                naoLidas,
                config
        );
    }

    private void validarCpfUnico(String cpf, String usuarioIdIgnorar) {
        if (cpf == null || cpf.isBlank()) {
            return;
        }
        String rawCpf = cpf.replaceAll("\\D", "");
        if (rawCpf.isBlank()) {
            return;
        }

        String formattedCpf = rawCpf.length() == 11
                ? String.format("%s.%s.%s-%s",
                rawCpf.substring(0, 3),
                rawCpf.substring(3, 6),
                rawCpf.substring(6, 9),
                rawCpf.substring(9, 11))
                : rawCpf;

        List<String> variantes = List.of(rawCpf, formattedCpf, cpf.trim());
        List<Usuario> existentes = repository.findByCpfIn(variantes);
        if (existentes == null || existentes.isEmpty()) {
            existentes = repository.findByCpfVariants(rawCpf, formattedCpf);
        }

        if (existentes != null) {
            for (Usuario u : existentes) {
                if (usuarioIdIgnorar == null || !u.getId().equals(usuarioIdIgnorar)) {
                    throw new ApiException("CPF já cadastrado", HttpStatus.CONFLICT);
                }
            }
        }
    }

    private void validarDataNascimento(String dataNascimento) {
        if (dataNascimento == null || dataNascimento.isBlank()) {
            throw new ApiException("Data obrigatória", HttpStatus.BAD_REQUEST);
        }
        try {
            LocalDate dataNasc;
            String trimmed = dataNascimento.trim();
            if (trimmed.contains("/")) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                dataNasc = LocalDate.parse(trimmed, formatter);
            } else {
                dataNasc = LocalDate.parse(trimmed);
            }
            LocalDate hoje = LocalDate.now();
            if (dataNasc.isAfter(hoje)) {
                throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
            }
            int idade = Period.between(dataNasc, hoje).getYears();
            if (idade < 16) {
                throw new ApiException("Mínimo 16 anos", HttpStatus.BAD_REQUEST);
            }
            if (idade > 100) {
                throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
            }
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
        }
    }
}
