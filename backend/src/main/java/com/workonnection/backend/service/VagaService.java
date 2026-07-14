package com.workonnection.backend.service;

import com.workonnection.backend.dto.ComentarioDTO;
import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Comentario;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.UsuarioRepository;
import com.workonnection.backend.repository.VagaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class VagaService {

    private final VagaRepository vagaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    public VagaService(VagaRepository vagaRepository, 
                       UsuarioRepository usuarioRepository, 
                       NotificacaoService notificacaoService) {
        this.vagaRepository = vagaRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
    }

    public VagaResponseDTO salvar(VagaDTO dto, String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Vaga vaga = new Vaga();
        preencherVaga(vaga, dto);
        vaga.setUsuarioId(usuarioId);
        vaga.setNomeUsuario(usuario.getNome());
        return toDTO(vagaRepository.save(vaga));
    }

    public VagaResponseDTO editar(String vagaId, VagaDTO dto, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        verificarDono(vaga, usuarioId, "editar");
        preencherVaga(vaga, dto);
        return toDTO(vagaRepository.save(vaga));
    }

    public void excluir(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        verificarDono(vaga, usuarioId, "excluir");
        vagaRepository.deleteById(vagaId);
    }

    public VagaResponseDTO like(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);
        Usuario remetente = usuarioRepository.findById(usuarioId).orElse(null);

        List<String> likes = new ArrayList<>(orEmpty(vaga.getLikes()));
        List<String> dislikes = new ArrayList<>(orEmpty(vaga.getDislikes()));

        if (likes.contains(usuarioId)) {
            likes.remove(usuarioId);
        } else {
            likes.add(usuarioId);
            dislikes.remove(usuarioId);

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

    public VagaResponseDTO dislike(String vagaId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);

        List<String> likes = new ArrayList<>(orEmpty(vaga.getLikes()));
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

    public VagaResponseDTO comentar(String vagaId, String usuarioId, ComentarioDTO dto) {
        if (dto.texto() == null || dto.texto().isBlank()) {
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
                dto.texto().trim(),
                Instant.now()
        ));

        vaga.setComentarios(lista);
        VagaResponseDTO result = toDTO(vagaRepository.save(vaga));

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

    public VagaResponseDTO excluirComentario(String vagaId, String comentarioId, String usuarioId) {
        Vaga vaga = buscarOuErro(vagaId);

        List<Comentario> lista = new ArrayList<>(orEmptyC(vaga.getComentarios()));
        Comentario alvo = lista.stream()
                .filter(c -> c.getId().equals(comentarioId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Comentário não encontrado", HttpStatus.NOT_FOUND));

        if (!alvo.getUsuarioId().equals(usuarioId) && !vaga.getUsuarioId().equals(usuarioId)) {
            throw new ApiException("Sem permissão", HttpStatus.FORBIDDEN);
        }

        lista.remove(alvo);
        vaga.setComentarios(lista);
        return toDTO(vagaRepository.save(vaga));
    }

    public List<VagaResponseDTO> listarTodas() {
        return vagaRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<VagaResponseDTO> listarPorUsuario(String usuarioId) {
        return vagaRepository.findByUsuarioId(usuarioId).stream().map(this::toDTO).toList();
    }

    // ── Helpers Privados ──────────────────────────────────────────────────────

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
        validarData(dto.data());
        
        vaga.setEmpresa(dto.empresa());
        vaga.setCargo(dto.cargo());
        vaga.setDescricao(dto.descricao());
        vaga.setModalidade(dto.modalidade());
        vaga.setHorario(dto.horario());
        vaga.setBeneficios(dto.beneficios());
        vaga.setLocalizacao(dto.localizacao());
        vaga.setSalario(dto.salario());
        vaga.setData(dto.data());
        vaga.setRequisitos(dto.requisitos());
        vaga.setEmail(dto.email());
        vaga.setTiposUsuario(dto.tiposUsuario());

        vaga.setDataExpiracao(converterParaTTL(dto.data()));
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

    private Instant converterParaTTL(String data) {
        try {
            LocalDate dataLocal = LocalDate.parse(data);
            return dataLocal
                    .atTime(23, 59, 59)
                    .atZone(ZoneId.systemDefault())
                    .toInstant();
        } catch (Exception e) {
            throw new ApiException("Data inválida", HttpStatus.BAD_REQUEST);
        }
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