package com.workonnection.backend.service;

import com.workonnection.backend.dto.ConversaResumoDTO;
import com.workonnection.backend.dto.MensagemDTO;
import com.workonnection.backend.dto.MensagemResponseDTO;
import com.workonnection.backend.dto.PerfilPublicoDTO;
import com.workonnection.backend.dto.UsuarioPublicoDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Mensagem;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.MensagemRepository;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;
    private final PusherService pusherService;

    public ChatService(
            MensagemRepository mensagemRepository,
            UsuarioRepository usuarioRepository,
            NotificacaoService notificacaoService,
            PusherService pusherService
    ) {
        this.mensagemRepository = mensagemRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
        this.pusherService = pusherService;
    }

    public MensagemResponseDTO enviarMensagem(String remetenteId, String destinatarioId, MensagemDTO dto) {
        if (dto == null || dto.conteudo() == null || dto.conteudo().trim().isEmpty()) {
            throw new ApiException("Conteúdo da mensagem não pode ser vazio", HttpStatus.BAD_REQUEST);
        }

        if (remetenteId.equals(destinatarioId)) {
            throw new ApiException("Não é permitido enviar mensagens para si mesmo", HttpStatus.BAD_REQUEST);
        }

        Usuario remetente = usuarioRepository.findById(remetenteId)
                .orElseThrow(() -> new ApiException("Remetente não encontrado", HttpStatus.NOT_FOUND));

        Usuario destinatario = usuarioRepository.findById(destinatarioId)
                .orElseThrow(() -> new ApiException("Destinatário não encontrado", HttpStatus.NOT_FOUND));

        Mensagem mensagem = new Mensagem(remetenteId, destinatarioId, dto.conteudo().trim());
        Mensagem salva = mensagemRepository.save(mensagem);

        // Notifica o destinatário internamente
        try {
            notificacaoService.criar(
                    destinatarioId,
                    remetenteId,
                    remetente.getNome(),
                    "mensagem",
                    "Você recebeu uma nova mensagem de " + remetente.getNome(),
                    null
            );
        } catch (Exception e) {
            // Falhas de notificação secundária não devem abortar o envio da mensagem
            System.err.println("Erro ao criar notificação de mensagem: " + e.getMessage());
        }

        MensagemResponseDTO resposta = toResponseDTO(salva);

        // Dispara evento em tempo real via Pusher
        try {
            pusherService.dispararEvento("chat-" + destinatarioId, "nova-mensagem", resposta);
            pusherService.dispararEvento("chat-" + remetenteId, "mensagem-enviada", resposta);
        } catch (Exception e) {
            System.err.println("Aviso Pusher: " + e.getMessage());
        }

        return resposta;
    }

    public List<MensagemResponseDTO> buscarHistorico(String usuarioId, String contatoId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        usuarioRepository.findById(contatoId)
                .orElseThrow(() -> new ApiException("Contato não encontrado", HttpStatus.NOT_FOUND));

        List<Mensagem> historico = mensagemRepository.findHistoricoEntreUsuarios(
                usuarioId,
                contatoId,
                Sort.by(Sort.Direction.ASC, "dataEnvio")
        );

        return historico.stream().map(this::toResponseDTO).toList();
    }

    public void marcarComoLidas(String usuarioId, String contatoId) {
        List<Mensagem> naoLidas = mensagemRepository
                .findByDestinatarioIdAndRemetenteIdAndLidaFalse(usuarioId, contatoId);

        if (!naoLidas.isEmpty()) {
            for (Mensagem msg : naoLidas) {
                msg.setLida(true);
            }
            mensagemRepository.saveAll(naoLidas);

            // Notifica o remetente em tempo real que suas mensagens foram lidas
            try {
                pusherService.dispararEvento("chat-" + contatoId, "mensagens-lidas", Map.of("leitorId", usuarioId));
            } catch (Exception e) {
                System.err.println("Aviso Pusher: " + e.getMessage());
            }
        }
    }

    public List<ConversaResumoDTO> listarConversas(String usuarioId) {
        List<Mensagem> todas = mensagemRepository.findAllByUsuarioId(
                usuarioId,
                Sort.by(Sort.Direction.DESC, "dataEnvio")
        );

        Map<String, Mensagem> conversasMap = new LinkedHashMap<>();
        for (Mensagem msg : todas) {
            String contatoId = msg.getRemetenteId().equals(usuarioId)
                    ? msg.getDestinatarioId()
                    : msg.getRemetenteId();

            if (!conversasMap.containsKey(contatoId)) {
                conversasMap.put(contatoId, msg);
            }
        }

        List<ConversaResumoDTO> resumos = new ArrayList<>();
        for (Map.Entry<String, Mensagem> entry : conversasMap.entrySet()) {
            String contatoId = entry.getKey();
            Mensagem ultimaMsg = entry.getValue();

            Usuario contato = usuarioRepository.findById(contatoId).orElse(null);
            if (contato == null) {
                continue;
            }

            long naoLidas = mensagemRepository.countByDestinatarioIdAndRemetenteIdAndLidaFalse(usuarioId, contatoId);

            resumos.add(new ConversaResumoDTO(
                    toUsuarioPublicoDTO(contato),
                    toResponseDTO(ultimaMsg),
                    naoLidas
            ));
        }

        return resumos;
    }

    public long contarTotalNaoLidas(String usuarioId) {
        return mensagemRepository.countByDestinatarioIdAndLidaFalse(usuarioId);
    }

    public UsuarioPublicoDTO toUsuarioPublicoDTO(Usuario u) {
        if (u == null) return null;
        Usuario.Perfil p = u.getPerfil();
        PerfilPublicoDTO perfilDto = null;
        if (p != null) {
            perfilDto = new PerfilPublicoDTO(
                    p.getSobre(),
                    p.getLocal(),
                    p.getInstagram(),
                    p.getLinkedin(),
                    p.getSite(),
                    p.getHabilidades(),
                    p.getFormacoes(),
                    p.getExperiencias(),
                    p.getCursos()
            );
        }
        return new UsuarioPublicoDTO(u.getId(), u.getNome(), u.getTipoUsuario(), perfilDto);
    }

    private MensagemResponseDTO toResponseDTO(Mensagem m) {
        return new MensagemResponseDTO(
                m.getId(),
                m.getRemetenteId(),
                m.getDestinatarioId(),
                m.getConteudo(),
                m.getDataEnvio(),
                m.isLida()
        );
    }
}
