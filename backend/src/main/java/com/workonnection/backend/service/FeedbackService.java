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
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final VagaRepository vagaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            CandidaturaRepository candidaturaRepository,
            VagaRepository vagaRepository,
            UsuarioRepository usuarioRepository,
            NotificacaoService notificacaoService
    ) {
        this.feedbackRepository = feedbackRepository;
        this.candidaturaRepository = candidaturaRepository;
        this.vagaRepository = vagaRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    /**
     * Envia o feedback do formulário (seja ele contratante ou candidato)
     */
    public FeedbackResponseDTO enviarFeedback(String candidaturaId, String usuarioId, FeedbackCreateDTO dto) {
        if (candidaturaId == null || candidaturaId.isBlank()) {
            throw new ApiException("ID da candidatura é obrigatório", HttpStatus.BAD_REQUEST);
        }
        if (dto == null) {
            throw new ApiException("Dados do feedback são obrigatórios", HttpStatus.BAD_REQUEST);
        }

        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new ApiException("Candidatura não encontrada", HttpStatus.NOT_FOUND));

        // Feedback só pode ser preenchido após a decisão/etapa de contratação (Aceito/Concluído/Em andamento ou Recusado)
        StatusCandidatura status = candidatura.getStatus();
        boolean statusElegivel = status == StatusCandidatura.CONCLUIDO
                || status == StatusCandidatura.RECUSADO
                || status == StatusCandidatura.EM_ANDAMENTO
                || status == StatusCandidatura.ALINHAMENTO_FINAL;

        if (!statusElegivel) {
            throw new ApiException("A candidatura ainda não atingiu a etapa de contratação ou encerramento (aceitação ou recusa).", HttpStatus.BAD_REQUEST);
        }

        boolean isContratante = usuarioId.equals(candidatura.getContratanteId());
        boolean isCandidato = usuarioId.equals(candidatura.getCandidatoId());

        if (!isContratante && !isCandidato) {
            throw new ApiException("Você não tem permissão para avaliar esta candidatura.", HttpStatus.FORBIDDEN);
        }

        if (feedbackRepository.existsByCandidaturaIdAndAutorId(candidaturaId, usuarioId)) {
            throw new ApiException("Você já enviou seu feedback para esta candidatura.", HttpStatus.CONFLICT);
        }

        Usuario autor = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário autor não encontrado", HttpStatus.NOT_FOUND));

        String destinatarioId = isContratante ? candidatura.getCandidatoId() : candidatura.getContratanteId();
        Usuario destinatario = usuarioRepository.findById(destinatarioId).orElse(null);

        Vaga vaga = vagaRepository.findById(candidatura.getVagaId()).orElse(null);
        String tituloVaga = vaga != null && vaga.getCargo() != null ? vaga.getCargo() : "Vaga Temporária";

        Feedback feedback = new Feedback();
        feedback.setCandidaturaId(candidaturaId);
        feedback.setVagaId(candidatura.getVagaId());
        feedback.setTituloVaga(tituloVaga);
        feedback.setAutorId(usuarioId);
        feedback.setAutorNome(autor.getNome());
        if (autor.getPerfil() != null && autor.getPerfil().getFotoPerfil() != null) {
            feedback.setAutorFotoUrl(autor.getPerfil().getFotoPerfil().getUrl());
        }
        feedback.setAutorTipo(autor.getTipoUsuario());
        feedback.setDestinatarioId(destinatarioId);

        String decisao = status == StatusCandidatura.RECUSADO ? "RECUSADO" : "ACEITO";
        feedback.setDecisao(decisao);
        feedback.setNotaGeral(dto.getNotaGeral());
        feedback.setCriadoEm(Instant.now());

        if (isContratante) {
            feedback.setTipoAutor("CONTRATANTE");
            feedback.setMotivoPrincipal(dto.getMotivoPrincipal());
            feedback.setCompetenciasMelhoria(dto.getCompetenciasMelhoria() != null ? dto.getCompetenciasMelhoria() : new ArrayList<>());
            feedback.setPontosFortes(dto.getPontosFortes() != null ? dto.getPontosFortes() : new ArrayList<>());
            feedback.setDicaConstrutiva(dto.getDicaConstrutiva());

            // Se for contratante preenchendo e for recusa, sincroniza no FeedbackSelecao da candidatura
            if ("RECUSADO".equals(decisao)) {
                FeedbackSelecao fs = new FeedbackSelecao(
                        dto.getMotivoPrincipal(),
                        dto.getCompetenciasMelhoria(),
                        dto.getPontosFortes(),
                        dto.getDicaConstrutiva()
                );
                candidatura.setFeedbackSelecao(fs);
                candidatura.setStatus(StatusCandidatura.RECUSADO);
                candidaturaRepository.save(candidatura);
            } else if ("ACEITO".equals(decisao)) {
                candidatura.setStatus(StatusCandidatura.CONCLUIDO);
                candidaturaRepository.save(candidatura);

                // Quando tiver um contratado, a vaga fecha (é apagada)
                if (vaga != null && vaga.getId() != null) {
                    vagaRepository.deleteById(vaga.getId());
                }
            }
        } else {
            feedback.setTipoAutor("CANDIDATO");
            feedback.setAvaliacaoProcesso(dto.getAvaliacaoProcesso());
            feedback.setAvaliacaoEmpresa(dto.getAvaliacaoEmpresa());
            feedback.setClarezaRequisitos(dto.getClarezaRequisitos());
            feedback.setComunicacaoContratante(dto.getComunicacaoContratante());
        }

        Feedback salvo = feedbackRepository.save(feedback);

        // Notificações para contratante e contratado
        String autorNome = autor.getNome() != null ? autor.getNome() : "O contratante/candidato";
        String candidatoNome = destinatario != null && destinatario.getNome() != null ? destinatario.getNome() : "O candidato";

        if (isContratante) {
            if ("ACEITO".equals(decisao)) {
                // Mensagem para o contratado (candidato)
                notificacaoService.criar(
                        destinatarioId,
                        usuarioId,
                        autorNome,
                        "contratacao_sucesso",
                        "Parabéns! Você foi contratado para a vaga " + tituloVaga + " por " + autorNome + "! A vaga foi encerrada com sucesso.",
                        candidaturaId
                );
                // Mensagem para o contratante
                notificacaoService.criar(
                        usuarioId,
                        destinatarioId,
                        candidatoNome,
                        "contratacao_sucesso",
                        "Contratação realizada! Você contratou " + candidatoNome + " para a vaga " + tituloVaga + ". A vaga foi encerrada com sucesso.",
                        candidaturaId
                );
            } else {
                // Decisão: RECUSADO -> vaga continua aberta, mensagem para ambos
                notificacaoService.criar(
                        destinatarioId,
                        usuarioId,
                        autorNome,
                        "candidatura_feedback",
                        autorNome + " enviou um feedback de seleção para a vaga " + tituloVaga + ". Agradecemos sua participação no processo!",
                        candidaturaId
                );
                notificacaoService.criar(
                        usuarioId,
                        destinatarioId,
                        candidatoNome,
                        "candidatura_feedback",
                        "Você registrou a recusa com feedback para " + candidatoNome + " na vaga " + tituloVaga + ". A vaga continua aberta para novos candidatos.",
                        candidaturaId
                );
            }
        } else {
            // Candidato avaliando processo / empresa
            notificacaoService.criar(
                    destinatarioId,
                    usuarioId,
                    autorNome,
                    "feedback_recebido",
                    autorNome + " enviou um feedback sobre a experiência no processo da vaga " + tituloVaga + ".",
                    candidaturaId
            );
        }

        return FeedbackResponseDTO.fromModel(salvo);
    }

    /**
     * Retorna os feedbacks recebidos por um usuário (para exibição no Perfil, por exemplo os mais recentes)
     */
    public List<FeedbackResponseDTO> listarFeedbacksDoPerfil(String usuarioId, int limite) {
        if (usuarioId == null || usuarioId.isBlank()) {
            throw new ApiException("ID do usuário é obrigatório", HttpStatus.BAD_REQUEST);
        }

        int max = limite > 0 ? Math.min(limite, 50) : 10;
        List<Feedback> feedbacks = feedbackRepository.findByDestinatarioIdOrderByCriadoEmDesc(
                usuarioId,
                PageRequest.of(0, max)
        );

        return feedbacks.stream()
                .map(FeedbackResponseDTO::fromModel)
                .collect(Collectors.toList());
    }

    /**
     * Consulta o status de feedback de uma candidatura específica para saber se o contratante ou candidato já enviaram
     */
    public StatusFeedbackCandidaturaDTO buscarStatusFeedback(String candidaturaId, String usuarioId) {
        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new ApiException("Candidatura não encontrada", HttpStatus.NOT_FOUND));

        List<Feedback> feedbacks = feedbackRepository.findByCandidaturaId(candidaturaId);

        boolean contratanteEnviou = feedbacks.stream().anyMatch(f -> "CONTRATANTE".equals(f.getTipoAutor()));
        boolean candidatoEnviou = feedbacks.stream().anyMatch(f -> "CANDIDATO".equals(f.getTipoAutor()));

        Feedback meu = feedbacks.stream().filter(f -> usuarioId.equals(f.getAutorId())).findFirst().orElse(null);
        Feedback outro = feedbacks.stream().filter(f -> !usuarioId.equals(f.getAutorId())).findFirst().orElse(null);

        return new StatusFeedbackCandidaturaDTO(
                contratanteEnviou,
                candidatoEnviou,
                meu != null ? FeedbackResponseDTO.fromModel(meu) : null,
                outro != null ? FeedbackResponseDTO.fromModel(outro) : null
        );
    }
}
