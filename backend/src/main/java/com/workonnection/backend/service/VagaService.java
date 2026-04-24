package com.workonnection.backend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.Instant;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
 
import com.workonnection.backend.dto.ComentarioDTO;
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Comentario;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;

@Service
public class VagaService {

    private final VagaRepository vagaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    public VagaService(VagaRepository vagaRepository, UsuarioRepository usuarioRepository, NotificacaoService notificacaoService) {
        this.vagaRepository = vagaRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    // ── Criar ─────────────────────────────────────────────────────────────────

    public VagaResponseDTO salvar(VagaDTO dto, String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Vaga vaga = new Vaga();
        preencherVaga(vaga, dto);
        vaga.setUsuarioId(usuarioId);
        vaga.setNomeUsuario(usuario.getNome());
        return toDTO(vagaRepository.save(vaga));
    }

    // ── Editar ────────────────────────────────────────────────────────────────

    public VagaResponseDTO editar(String vagaId, VagaDTO dto, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        verificarDono(vaga, usuarioId, "editar");
        preencherVaga(vaga, dto);
        return toDTO(vagaRepository.save(vaga));
    }

    private void validarData(String data) {
        try {
            LocalDate dataVaga = LocalDate.parse(data);
            LocalDate hoje = LocalDate.now();

            if (dataVaga.isBefore(hoje)) {
                throw new ApiException("Data limite não pode ser no passado", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
        }
    }

    // ── Excluir ───────────────────────────────────────────────────────────────

    public void excluir(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        verificarDono(vaga, usuarioId, "excluir");
        vagaRepository.deleteById(vagaId);
    }

    private Instant converterParaTTL(String data) {
        try {
            LocalDate dataLocal = LocalDate.parse(data);

            return dataLocal
                    .atTime(23, 59, 59) // expira no fim do dia
                    .atZone(java.time.ZoneId.systemDefault())
                    .toInstant();

        } catch (Exception e) {
            throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
        }
    }

    // ── Like ──────────────────────────────────────────────────────────────────

    public VagaResponseDTO like(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        Usuario remetente = usuarioRepository.findById(usuarioId).orElse(null);

        List<String> likes    = new ArrayList<>(orEmpty(vaga.getLikes()));
        List<String> dislikes = new ArrayList<>(orEmpty(vaga.getDislikes()));

        // Toggle: remove se já curtiu, adiciona se não curtiu
        if (likes.contains(usuarioId)) {
            likes.remove(usuarioId);
        } else {
            likes.add(usuarioId);
            dislikes.remove(usuarioId); // remove dislike se existia

            if (remetente != null) {
                notificacaoService.criar(
                    vaga.getUsuarioId(),
                    usuarioId,
                    remetente.getNome(),
                    "like",
                    remetente.getNome() + " curtiu sua vaga \"" + vaga.getCargo() + "\"",
                    vagaId
                );
            }
        }

        vaga.setLikes(likes);
        vaga.setDislikes(dislikes);
        return toDTO(vagaRepository.save(vaga));
    }

    // ── Dislike ───────────────────────────────────────────────────────────────

    public VagaResponseDTO dislike(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);

        List<String> likes    = new ArrayList<>(orEmpty(vaga.getLikes()));
        List<String> dislikes = new ArrayList<>(orEmpty(vaga.getDislikes()));

        if (dislikes.contains(usuarioId)) {
            dislikes.remove(usuarioId);
        } else {
            dislikes.add(usuarioId);
            likes.remove(usuarioId);
        }

        vaga.setLikes(likes);
        vaga.setDislikes(dislikes);
        return toDTO(vagaRepository.save(vaga));
    }

    // ── Comentar ──────────────────────────────────────────────────────────────

    public VagaResponseDTO comentar(String vagaId, String usuarioId, ComentarioDTO dto) {
        if (dto.getTexto() == null || dto.getTexto().isBlank()) {
            throw new ApiException("Comentário não pode ser vazio", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Vaga vaga = buscarOuErro(vagaId);

        List<Comentario> lista = new ArrayList<>(orEmptyC(vaga.getComentarios()));
        lista.add(new Comentario(
                UUID.randomUUID().toString(),
                usuarioId,
                usuario.getNome(),
                dto.getTexto().trim(),
                Instant.now()
        ));

        vaga.setComentarios(lista);
        VagaResponseDTO result = toDTO(vagaRepository.save(vaga));

        //Notifica o dono da vaga
        notificacaoService.criar(
            vaga.getUsuarioId(),
            usuarioId,
            usuario.getNome(),
            "comentario",
            usuario.getNome() + " comentou na sua vaga \"" + vaga.getCargo() + "\"",
            vagaId
        );
        
        return result;
    }
    

    // ── Excluir comentário ────────────────────────────────────────────────────

    public VagaResponseDTO excluirComentario(String vagaId, String comentarioId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);

        List<Comentario> lista = new ArrayList<>(orEmptyC(vaga.getComentarios()));
        Comentario alvo = lista.stream()
                .filter(c -> c.getId().equals(comentarioId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Comentário não encontrado", HttpStatus.NOT_FOUND));

        // Só o autor do comentário ou o dono da vaga pode excluir
        if (!alvo.getUsuarioId().equals(usuarioId) && !vaga.getUsuarioId().equals(usuarioId)) {
            throw new ApiException("Sem permissão", HttpStatus.FORBIDDEN);
        }

        lista.remove(alvo);
        vaga.setComentarios(lista);
        return toDTO(vagaRepository.save(vaga));
    }

    // ── Listar todas ──────────────────────────────────────────────────────────

    public List<VagaResponseDTO> listarTodas() {
        return vagaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Listar por usuário ────────────────────────────────────────────────────

    public List<VagaResponseDTO> listarPorUsuario(String usuarioId) {
        return vagaRepository.findByUsuarioId(usuarioId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Vaga buscarOuErro(String id) {
        return vagaRepository.findById(id)
                .orElseThrow(() -> new ApiException("Vaga não encontrada", HttpStatus.NOT_FOUND));
    }

    private void verificarDono(Vaga vaga, String usuarioId, String acao) {
        if (!vaga.getUsuarioId().equals(usuarioId)) {
            throw new ApiException("Sem permissão para " + acao + " esta vaga", HttpStatus.FORBIDDEN);
        }
    }

    private void preencherVaga(Vaga vaga, VagaDTO dto) {
        validarData(dto.getData());
        
        vaga.setEmpresa(dto.getEmpresa());
        vaga.setCargo(dto.getCargo());
        vaga.setDescricao(dto.getDescricao());
        vaga.setModalidade(dto.getModalidade());
        vaga.setHorario(dto.getHorario());
        vaga.setBeneficios(dto.getBeneficios());
        vaga.setLocalizacao(dto.getLocalizacao());
        vaga.setSalario(dto.getSalario());
        vaga.setData(dto.getData());
        vaga.setRequisitos(dto.getRequisitos());
        vaga.setEmail(dto.getEmail());
        vaga.setTiposUsuario(dto.getTiposUsuario());

        vaga.setDataExpiracao(converterParaTTL(dto.getData()));
    }

    private VagaResponseDTO toDTO(Vaga v) {
        return new VagaResponseDTO(
            v.getId(),
            v.getNomeUsuario(),
            v.getEmpresa(),
            v.getCargo(),
            v.getDescricao(),
            v.getModalidade(),
            v.getHorario(),
            v.getBeneficios(),
            v.getLocalizacao(),
            v.getSalario(),
            v.getData(),
            v.getRequisitos(),
            v.getEmail(),
            v.getUsuarioId(),
            v.getTiposUsuario(),
            orEmpty(v.getLikes()),
            orEmpty(v.getDislikes()),
            orEmptyC(v.getComentarios())
        );
    }

    private List<String> orEmpty(List<String> l) { return l != null ? l : new ArrayList<>(); }
    private List<Comentario> orEmptyC(List<Comentario> l) { return l != null ? l : new ArrayList<>(); }
}