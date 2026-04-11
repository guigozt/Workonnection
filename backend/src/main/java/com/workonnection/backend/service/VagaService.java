package com.workonnection.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.model.Vaga;
import com.workonnection.backend.repository.VagaRepository;

@Service
public class VagaService {

    private final VagaRepository repository;

    public VagaService(VagaRepository repository) {
        this.repository = repository;
    }

    public VagaResponseDTO salvar(VagaDTO dto, String usuarioId) {

        Vaga vaga = new Vaga();
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
        vaga.setUsuarioId(usuarioId);

        Vaga salva = repository.save(vaga);

        return toDTO(salva);
    }

    public List<VagaResponseDTO> listarTodas() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<VagaResponseDTO> listarPorUsuario(String usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
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
                vaga.getUsuarioId()
        );
    }
}