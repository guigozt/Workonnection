package com.workonnection.backend.service;

import com.workonnection.backend.dto.CandidaturaCreateDTO;
import com.workonnection.backend.dto.CandidaturaResponseDTO;
import com.workonnection.backend.dto.FeedbackRecusaDTO;
import com.workonnection.backend.dto.StatusUpdateDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Candidatura;
import com.workonnection.backend.model.FeedbackSelecao;
import com.workonnection.backend.model.StatusCandidatura;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.CandidaturaRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CandidaturaService {

    private final CandidaturaRepository candidaturaRepository;
    private final VagaRepository vagaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    public CandidaturaService(
            CandidaturaRepository candidaturaRepository,
            VagaRepository vagaRepository,
            UsuarioRepository usuarioRepository,
            NotificacaoService notificacaoService
    ) {
        this.candidaturaRepository = candidaturaRepository;
        this.vagaRepository = vagaRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    public CandidaturaResponseDTO candidatar(String vagaId, String candidatoId, CandidaturaCreateDTO dto) {
        if (vagaId == null || vagaId.isBlank()) {
            throw new ApiException("ID da vaga é obrigatório", HttpStatus.BAD_REQUEST);
        }

        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ApiException("Vaga não encontrada", HttpStatus.NOT_FOUND));

        Usuario candidato = usuarioRepository.findById(candidatoId)
                .orElseThrow(() -> new ApiException("Usuário candidato não encontrado", HttpStatus.NOT_FOUND));

        if (candidatoId.equals(vaga.getUsuarioId())) {
            throw new ApiException("Você não pode se candidatar à sua própria vaga", HttpStatus.BAD_REQUEST);
        }

        if (candidaturaRepository.existsByVagaIdAndCandidatoId(vagaId, candidatoId)) {
            throw new ApiException("Você já possui uma candidatura ativa para esta vaga", HttpStatus.CONFLICT);
        }

        // Validação de público-alvo da vaga temporária
        validarCompatibilidadePublicoAlvo(vaga, candidato);

        Candidatura candidatura = new Candidatura();
        candidatura.setVagaId(vagaId);
        candidatura.setCandidatoId(candidatoId);
        candidatura.setTipoCandidato(candidato.getTipoUsuario());
        candidatura.setContratanteId(vaga.getUsuarioId());
        candidatura.setStatus(StatusCandidatura.INSCRITO);
        candidatura.setMensagemApresentacao(dto != null ? dto.getMensagemApresentacao() : null);
        candidatura.setCriadaEm(Instant.now());
        candidatura.setAtualizadaEm(Instant.now());

        Candidatura salva = candidaturaRepository.save(candidatura);

        // Notificar Contratante sobre a nova candidatura
        String nomeCandidato = candidato.getNome() != null ? candidato.getNome() : "Um candidato";
        String tituloCargo = vaga.getCargo() != null ? vaga.getCargo() : "Vaga Temporária";
        notificacaoService.criar(
                vaga.getUsuarioId(),
                candidatoId,
                nomeCandidato,
                "candidatura_nova",
                nomeCandidato + " se candidatou para a sua vaga temporária: " + tituloCargo,
                vagaId
        );

        return toResponseDTO(salva, vaga, candidato);
    }

    public List<CandidaturaResponseDTO> listarMinhas(String candidatoId) {
        List<Candidatura> candidaturas = candidaturaRepository.findByCandidatoId(candidatoId);
        if (candidaturas.isEmpty()) {
            return Collections.emptyList();
        }

        candidaturas.sort(Comparator.comparing(Candidatura::getAtualizadaEm, Comparator.nullsLast(Comparator.reverseOrder())));

        // Buscar vagas e perfis para montar DTOs ricos
        Map<String, Vaga> vagasMap = vagaRepository.findAllById(
                candidaturas.stream().map(Candidatura::getVagaId).collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(Vaga::getId, v -> v));

        Usuario candidato = usuarioRepository.findById(candidatoId).orElse(null);

        return candidaturas.stream()
                .map(c -> toResponseDTO(c, vagasMap.get(c.getVagaId()), candidato))
                .collect(Collectors.toList());
    }

    public List<CandidaturaResponseDTO> gerenciarRecebidas(String contratanteId, String vagaId) {
        List<Candidatura> candidaturas;
        if (vagaId != null && !vagaId.isBlank()) {
            candidaturas = candidaturaRepository.findByContratanteIdAndVagaId(contratanteId, vagaId);
        } else {
            candidaturas = candidaturaRepository.findByContratanteId(contratanteId);
        }

        if (candidaturas.isEmpty()) {
            return Collections.emptyList();
        }

        candidaturas.sort(Comparator.comparing(Candidatura::getAtualizadaEm, Comparator.nullsLast(Comparator.reverseOrder())));

        Map<String, Vaga> vagasMap = vagaRepository.findAllById(
                candidaturas.stream().map(Candidatura::getVagaId).collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(Vaga::getId, v -> v));

        Map<String, Usuario> candidatosMap = usuarioRepository.findAllById(
                candidaturas.stream().map(Candidatura::getCandidatoId).collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(Usuario::getId, u -> u));

        return candidaturas.stream()
                .map(c -> toResponseDTO(c, vagasMap.get(c.getVagaId()), candidatosMap.get(c.getCandidatoId())))
                .collect(Collectors.toList());
    }

    public CandidaturaResponseDTO buscarPorId(String id, String usuarioAutenticadoId) {
        Candidatura candidatura = buscarOuErro(id);

        if (!candidatura.getCandidatoId().equals(usuarioAutenticadoId)
                && !candidatura.getContratanteId().equals(usuarioAutenticadoId)) {
            throw new ApiException("Acesso não autorizado para esta candidatura", HttpStatus.FORBIDDEN);
        }

        Vaga vaga = vagaRepository.findById(candidatura.getVagaId()).orElse(null);
        Usuario candidato = usuarioRepository.findById(candidatura.getCandidatoId()).orElse(null);

        return toResponseDTO(candidatura, vaga, candidato);
    }

    public CandidaturaResponseDTO atualizarStatus(String id, String contratanteId, StatusUpdateDTO dto) {
        if (dto == null || dto.getStatus() == null) {
            throw new ApiException("Status é obrigatório", HttpStatus.BAD_REQUEST);
        }

        Candidatura candidatura = buscarOuErro(id);

        if (!contratanteId.equals(candidatura.getContratanteId())) {
            throw new ApiException("Apenas o contratante responsável pela vaga pode alterar o status", HttpStatus.FORBIDDEN);
        }

        if (dto.getStatus() == StatusCandidatura.RECUSADO) {
            throw new ApiException("Para recusar um candidato, use o endpoint específico de recusa com feedback obrigatório", HttpStatus.BAD_REQUEST);
        }

        candidatura.setStatus(dto.getStatus());
        Candidatura salva = candidaturaRepository.save(candidatura);

        Vaga vaga = vagaRepository.findById(candidatura.getVagaId()).orElse(null);
        Usuario candidato = usuarioRepository.findById(candidatura.getCandidatoId()).orElse(null);
        Usuario contratante = usuarioRepository.findById(contratanteId).orElse(null);

        String nomeContratante = contratante != null && contratante.getNome() != null ? contratante.getNome() : "O contratante";
        String tituloCargo = vaga != null && vaga.getCargo() != null ? vaga.getCargo() : "Vaga Temporária";

        // Notificações por status
        if (dto.getStatus() == StatusCandidatura.EM_CHAT) {
            notificacaoService.criar(
                    candidatura.getCandidatoId(),
                    contratanteId,
                    nomeContratante,
                    "candidatura_chat",
                    nomeContratante + " chamou você para alinhar detalhes no chat sobre a vaga: " + tituloCargo,
                    candidatura.getVagaId()
            );
        } else if (dto.getStatus() == StatusCandidatura.ALINHAMENTO_FINAL) {
            notificacaoService.criar(
                    candidatura.getCandidatoId(),
                    contratanteId,
                    nomeContratante,
                    "candidatura_aceite",
                    "Parabéns! Sua candidatura para a vaga " + tituloCargo + " foi selecionada para a etapa final!",
                    candidatura.getVagaId()
            );
        }

        return toResponseDTO(salva, vaga, candidato);
    }

    public CandidaturaResponseDTO recusarComFeedback(String id, String contratanteId, FeedbackRecusaDTO dto) {
        if (dto == null || dto.getMotivoPrincipal() == null || dto.getMotivoPrincipal().trim().isBlank()) {
            throw new ApiException("O motivo principal do feedback é obrigatório para não selecionar o candidato.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Candidatura candidatura = buscarOuErro(id);

        if (!contratanteId.equals(candidatura.getContratanteId())) {
            throw new ApiException("Apenas o contratante responsável pode realizar a recusa", HttpStatus.FORBIDDEN);
        }

        FeedbackSelecao feedback = new FeedbackSelecao(
                dto.getMotivoPrincipal().trim(),
                dto.getCompetenciasMelhoria() != null ? dto.getCompetenciasMelhoria() : new ArrayList<>(),
                dto.getPontosFortes() != null ? dto.getPontosFortes() : new ArrayList<>(),
                dto.getDicaConstrutiva() != null ? dto.getDicaConstrutiva().trim() : null
        );

        candidatura.setFeedbackSelecao(feedback);
        candidatura.setStatus(StatusCandidatura.RECUSADO);
        Candidatura salva = candidaturaRepository.save(candidatura);

        Vaga vaga = vagaRepository.findById(candidatura.getVagaId()).orElse(null);
        Usuario candidato = usuarioRepository.findById(candidatura.getCandidatoId()).orElse(null);
        Usuario contratante = usuarioRepository.findById(contratanteId).orElse(null);

        String nomeContratante = contratante != null && contratante.getNome() != null ? contratante.getNome() : "O contratante";
        String tituloCargo = vaga != null && vaga.getCargo() != null ? vaga.getCargo() : "Vaga Temporária";

        // Notificação construtiva ao candidato
        notificacaoService.criar(
                candidatura.getCandidatoId(),
                contratanteId,
                nomeContratante,
                "candidatura_feedback",
                "Você recebeu um feedback construtivo sobre o processo da vaga " + tituloCargo + ". Confira suas oportunidades de aprendizado!",
                candidatura.getVagaId()
        );

        return toResponseDTO(salva, vaga, candidato);
    }

    private Candidatura buscarOuErro(String id) {
        return candidaturaRepository.findById(id)
                .orElseThrow(() -> new ApiException("Candidatura não encontrada", HttpStatus.NOT_FOUND));
    }

    private void validarCompatibilidadePublicoAlvo(Vaga vaga, Usuario candidato) {
        List<String> permitidos = vaga.getTiposUsuario();
        if (permitidos == null || permitidos.isEmpty()) {
            return;
        }

        String tipoCandidato = candidato.getTipoUsuario();
        if (tipoCandidato == null) {
            return;
        }

        String tipoNormalizado = normalizarTipo(tipoCandidato);

        boolean compativel = permitidos.stream().anyMatch(p -> {
            if (p == null) return false;
            String norm = normalizarTipo(p);
            return norm.equals("todos") || norm.equals(tipoNormalizado);
        });

        if (!compativel) {
            throw new ApiException("Esta vaga temporária é destinada especificamente para outros perfis: " + String.join(", ", permitidos), HttpStatus.BAD_REQUEST);
        }
    }

    private String normalizarTipo(String tipo) {
        String t = tipo.trim().toLowerCase();
        if (t.contains("estudante")) return "estudante";
        if (t.contains("mei") || t.contains("microempreendedor")) return "microempreendedor";
        if (t.contains("autonomo") || t.contains("autônomo")) return "autonomo";
        if (t.contains("empresa") || t.contains("microempresa")) return "empresa";
        return t;
    }

    private CandidaturaResponseDTO toResponseDTO(Candidatura c, Vaga vaga, Usuario candidato) {
        CandidaturaResponseDTO dto = new CandidaturaResponseDTO();
        dto.setId(c.getId());
        dto.setVagaId(c.getVagaId());
        dto.setCandidatoId(c.getCandidatoId());
        dto.setTipoCandidato(c.getTipoCandidato());
        dto.setContratanteId(c.getContratanteId());
        dto.setStatus(c.getStatus());
        dto.setMensagemApresentacao(c.getMensagemApresentacao());
        dto.setFeedbackSelecao(c.getFeedbackSelecao());
        dto.setCriadaEm(c.getCriadaEm());
        dto.setAtualizadaEm(c.getAtualizadaEm());

        if (vaga != null) {
            dto.setVagaCargo(vaga.getCargo());
            dto.setVagaEmpresa(vaga.getEmpresa());
            dto.setVagaModalidade(vaga.getModalidade());
            dto.setVagaSalario(vaga.getSalario());
            dto.setVagaLocalizacao(vaga.getLocalizacao());
        }

        if (candidato != null) {
            dto.setCandidatoNome(candidato.getNome());
            dto.setCandidatoEmail(candidato.getEmail());
            if (candidato.getPerfil() != null) {
                dto.setCandidatoSobre(candidato.getPerfil().getSobre());
                dto.setCandidatoHabilidades(candidato.getPerfil().getHabilidades());
                if (candidato.getPerfil().getFotoPerfil() != null) {
                    dto.setCandidatoFotoUrl(candidato.getPerfil().getFotoPerfil().getUrl());
                }
            }
        }

        return dto;
    }
}
