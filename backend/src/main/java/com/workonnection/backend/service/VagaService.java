package com.workonnection.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.VagaRepository;

@Service
public class VagaService {

    private final VagaRepository repository;

    public VagaService(VagaRepository repository) {
        this.repository = repository;
    }

    // ── Criar ─────────────────────────────────────────────────────────────────

    public VagaResponseDTO salvar(VagaDTO dto, String usuarioId) {
        Vaga vaga = new Vaga();
        preencherVaga(vaga, dto);
        vaga.setUsuarioId(usuarioId);
        return toDTO(repository.save(vaga));
    }

    // ── Editar ─────────────────────────────────────────────────────────────────
    
    public VagaResponseDTO editar(String vagaId, VagaDTO dto, String usuarioId) {
        Vaga vaga = repository.findById(vagaId)
            .orElseThrow(() -> new ApiException("Vaga não encontrada", HttpStatus.NOT_FOUND));

        //Só o dono pode editar
        if (!vaga.getUsuarioId().equals(usuarioId)) {
            throw new ApiException("Sem permissão de editar esta vaga", HttpStatus.FORBIDDEN);
        }

        preencherVaga(vaga, dto);
        return toDTO(repository.save(vaga));
    }

    // ── Excluir ───────────────────────────────────────────────────────────────
 
    public void excluir(String vagaId, String usuarioId) {
        Vaga vaga = repository.findById(vagaId)
                .orElseThrow(() -> new ApiException("Vaga não encontrada", HttpStatus.NOT_FOUND));
 
        // Só o dono pode excluir
        if (!vaga.getUsuarioId().equals(usuarioId)) {
            throw new ApiException("Sem permissão para excluir esta vaga", HttpStatus.FORBIDDEN);
        }
 
        repository.deleteById(vagaId);
    }

    // ── Listar todas ──────────────────────────────────────────────────────────
 
    public List<VagaResponseDTO> listarTodas() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
 
    // ── Listar por usuário ────────────────────────────────────────────────────
 
    public List<VagaResponseDTO> listarPorUsuario(String usuarioId) {
        return repository.findByUsuarioId(usuarioId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
 
    private void preencherVaga(Vaga vaga, VagaDTO dto) {
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
    }

    private VagaResponseDTO toDTO(Vaga vaga) {
        return new VagaResponseDTO(
                vaga.getId(),
                vaga.getEmpresa(),
                vaga.getCargo(),
                vaga.getDescricao(),
                vaga.getModalidade(),
                vaga.getHorario(),
                vaga.getBeneficios(),
                vaga.getLocalizacao(),
                vaga.getSalario(),
                vaga.getData(),
                vaga.getRequisitos(),
                vaga.getEmail(),
                vaga.getUsuarioId(),
                vaga.getTiposUsuario()
        );
    }
}