package com.workonnection.backend.controller;

import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarColaboradores());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody CadastroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody LoginDTO dto, HttpSession session) {
        UsuarioResponseDTO response = service.login(dto);
        session.setAttribute("usuarioId", response.id());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
            response.email(), null, Collections.emptyList()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> usuarioLogado(HttpSession session) {
        String id = getLoggerUserId(session);
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(@RequestBody PerfilDTO dto, HttpSession session) {
        String id = getLoggerUserId(session);
        return ResponseEntity.ok(service.atualizarPerfil(id, dto));
    }

    @PutMapping("/configuracoes")
    public ResponseEntity<UsuarioResponseDTO> atualizarConfiguracoes(@RequestBody ConfiguracoesDTO dto, HttpSession session) {
        String id = getLoggerUserId(session);
        return ResponseEntity.ok(service.atualizarConfiguracoes(id, dto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    private String getLoggerUserId(HttpSession session) {
        String id = (String) session.getAttribute("usuarioId");
        if (id == null) {
            throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);
        }
        return id;
    }
}
