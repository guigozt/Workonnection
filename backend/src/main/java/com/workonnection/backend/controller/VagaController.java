package com.workonnection.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workonnection.backend.dto.VagaDTO;
import com.workonnection.backend.dto.VagaResponseDTO;
import com.workonnection.backend.service.VagaService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/vagas")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class VagaController {

    private final VagaService service;

    public VagaController(VagaService service) {
        this.service = service;
    }

    @PostMapping
    public VagaResponseDTO criar(@RequestBody VagaDTO dto, HttpSession session) {

        String usuarioId = (String) session.getAttribute("usuarioId");

        if (usuarioId == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return service.salvar(dto, usuarioId);
    }

    @GetMapping
    public List<VagaResponseDTO> listar() {
        return service.listarTodas();
    }

    @GetMapping("/minhas")
    public List<VagaResponseDTO> minhas(HttpSession session) {

        String usuarioId = (String) session.getAttribute("usuarioId");

        if (usuarioId == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return service.listarPorUsuario(usuarioId);
    }
}