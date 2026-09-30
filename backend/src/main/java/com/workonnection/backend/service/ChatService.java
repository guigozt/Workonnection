package com.workonnection.backend.service;

import com.pusher.rest.Pusher;
import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Mensagem;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.MensagemRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final Pusher pusher;

    public ChatService(MensagemRepository mensagemRepository,
                       UsuarioRepository usuarioRepository,
                       Pusher pusher) {
        this.mensagemRepository = mensagemRepository;
        this.usuarioRepository = usuarioRepository;
        this.pusher = pusher;
    }

    public List<ConversaResumoDTO> listarConversas(String usuarioId) {
        List<Mensagem> todas = mensagemRepository.findAll().stream()
                .filter(m -> (m.getRemetenteId().equals(usuarioId) || m.getDestinatarioId().equals(usuarioId))
                        && !m.getExcluidaPara().contains(usuarioId))
                .toList();

        Map<String, List<Mensagem>> porContato = todas.stream().collect(Collectors.groupingBy(m ->
                m.getRemetenteId().equals(usuarioId) ? m.getDestinatarioId() : m.getRemetenteId()
        ));

        List<ConversaResumoDTO> resumos = new ArrayList<>();

        for (Map.Entry<String, List<Mensagem>> entry : porContato.entrySet()) {
            String contatoId = entry.getKey();
            List<Mensagem> mensagens = entry.getValue();

            if (mensagens.isEmpty()) continue;

            Mensagem ultima = mensagens.stream()
                    .max(Comparator.comparing(Mensagem::getDataEnvio))
                    .orElse(null);

            long naoLidas = mensagens.stream()
                    .filter(m -> m.getDestinatarioId().equals(usuarioId) && !m.isLida())
                    .count();

            Usuario contato = usuarioRepository.findById(contatoId).orElse(null);
            if (contato == null) continue;

            UsuarioPublicoDTO contatoDTO = new UsuarioPublicoDTO(
                    contato.getId(),
                    contato.getNome(),
                    contato.getFotoUrl()
            );

            resumos.add(new ConversaResumoDTO(contatoDTO, toDTO(ultima), naoLidas));
        }

        resumos.sort((a, b) -> b.ultimaMensagem().dataEnvio().compareTo(a.ultimaMensagem().dataEnvio()));
        return resumos;
    }

    public List<MensagemResponseDTO> buscarHistorico(String usuarioId, String contatoId) {
        return mensagemRepository.findHistoricoSemExcluidas(usuarioId, contatoId).stream()
                .sorted(Comparator.comparing(Mensagem::getDataEnvio))
                .map(this::toDTO)
                .toList();
    }

    public MensagemResponseDTO enviarMensagem(String remetenteId, String destinatarioId, MensagemDTO dto) {
        if (dto.conteudo() == null || dto.conteudo().trim().isEmpty()) {
            throw new ApiException("Conteúdo da mensagem não pode ser vazio", HttpStatus.BAD_REQUEST);
        }

        Mensagem msg = new Mensagem(remetenteId, destinatarioId, dto.conteudo().trim());
        Mensagem salva = mensagemRepository.save(msg);
        MensagemResponseDTO response = toDTO(salva);

        notificarPusher("chat-" + destinatarioId, "nova-mensagem", response);
        notificarPusher("chat-" + remetenteId, "nova-mensagem", response);

        return response;
    }

    public void marcarComoLidas(String usuarioId, String contatoId) {
        List<Mensagem> naoLidas = mensagemRepository.findByRemetenteIdAndDestinatarioIdAndLidaFalse(contatoId, usuarioId);
        if (naoLidas.isEmpty()) return;

        Instant agora = Instant.now();
        for (Mensagem m : naoLidas) {
            m.setLida(true);
            m.setDataLeitura(agora);
        }
        mensagemRepository.saveAll(naoLidas);

        Map<String, Object> payload = Map.of(
                "leitorId", usuarioId,
                "contatoId", contatoId,
                "dataLeitura", agora
        );

        notificarPusher("chat-" + contatoId, "mensagens-lidas", payload);
    }

    public MensagemResponseDTO editarMensagem(String usuarioId, String mensagemId, MensagemDTO dto) {
        Mensagem msg = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new ApiException("Mensagem não encontrada", HttpStatus.NOT_FOUND));

        if (!msg.getRemetenteId().equals(usuarioId)) {
            throw new ApiException("Apenas o remetente pode editar a mensagem", HttpStatus.FORBIDDEN);
        }

        if (dto.conteudo() == null || dto.conteudo().trim().isEmpty()) {
            throw new ApiException("Conteúdo da mensagem não pode ser vazio", HttpStatus.BAD_REQUEST);
        }

        msg.setConteudo(dto.conteudo().trim());
        msg.setEditada(true);
        msg.setDataEdicao(Instant.now());

        Mensagem salva = mensagemRepository.save(msg);
        MensagemResponseDTO response = toDTO(salva);

        notificarPusher("chat-" + msg.getDestinatarioId(), "mensagem-editada", response);
        notificarPusher("chat-" + msg.getRemetenteId(), "mensagem-editada", response);

        return response;
    }

    public void excluirMensagem(String usuarioId, String mensagemId) {
        Mensagem msg = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new ApiException("Mensagem não encontrada", HttpStatus.NOT_FOUND));

        if (!msg.getRemetenteId().equals(usuarioId) && !msg.getDestinatarioId().equals(usuarioId)) {
            throw new ApiException("Acesso negado para excluir esta mensagem", HttpStatus.FORBIDDEN);
        }

        if (!msg.getExcluidaPara().contains(usuarioId)) {
            msg.getExcluidaPara().add(usuarioId);
            mensagemRepository.save(msg);
        }

        Map<String, String> payload = Map.of("mensagemId", mensagemId, "usuarioId", usuarioId);
        notificarPusher("chat-" + usuarioId, "mensagem-excluida", payload);
    }

    public void excluirConversa(String usuarioId, String contatoId) {
        List<Mensagem> historico = mensagemRepository.findHistoricoSemExcluidas(usuarioId, contatoId);

        for (Mensagem msg : historico) {
            if (!msg.getExcluidaPara().contains(usuarioId)) {
                msg.getExcluidaPara().add(usuarioId);
            }
        }

        mensagemRepository.saveAll(historico);

        Map<String, String> payload = Map.of("contatoId", contatoId);
        notificarPusher("chat-" + usuarioId, "conversa-excluida", payload);
    }

    public long contarTotalNaoLidas(String usuarioId) {
        return mensagemRepository.countByDestinatarioIdAndLidaFalseAndExcluidaParaNotContaining(usuarioId, usuarioId);
    }

    private MensagemResponseDTO toDTO(Mensagem m) {
        if (m == null) return null;
        return new MensagemResponseDTO(
                m.getId(),
                m.getRemetenteId(),
                m.getDestinatarioId(),
                m.getConteudo(),
                m.getDataEnvio(),
                m.isLida(),
                m.getDataLeitura(),
                m.isEditada()
        );
    }

    private void notificarPusher(String channel, String event, Object data) {
        try {
            if (pusher != null) {
                pusher.trigger(channel, event, data);
            }
        } catch (Exception e) {
            System.err.println("Erro ao disparar evento Pusher: " + e.getMessage());
        }
    }
}