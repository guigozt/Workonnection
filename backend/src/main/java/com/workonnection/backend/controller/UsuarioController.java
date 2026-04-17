package com.workonnection.backend.controller;

import com.workonnection.backend.dto.CadastroDTO;
import com.workonnection.backend.dto.LoginDTO;
import com.workonnection.backend.dto.PerfilDTO;
import com.workonnection.backend.dto.UsuarioResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.UsuarioService;
import jakarta.servlet.http.HttpSession;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(
    origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:8080"
    },
    allowCredentials = "true"
)
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    // ── POST /usuarios  →  Cadastro ──────────────────────────────────────────
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody CadastroDTO dto) {
        UsuarioResponseDTO response = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201
    }

    // ── POST /usuarios/login  →  Login ───────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(
            @RequestBody LoginDTO dto,
            HttpSession session) {

        UsuarioResponseDTO response = service.login(dto);

        // salva na sessão (como já fazia)
        session.setAttribute("usuarioId", response.getId());

        // AGORA INTEGRA COM SPRING SECURITY
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        response.getEmail(),
                        null,
                        Collections.emptyList()
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        return ResponseEntity.ok(response);
    }
    
    // ── GET /usuarios/me  →  Sessão atual ────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> usuarioLogado(HttpSession session) {
        String id = (String) session.getAttribute("usuarioId");

        if (id == null) {
            throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED); // 401
        }

        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // ── PUT /usuarios/perfil  →  Atualiza perfil do usuário logado ───────────
    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
        @RequestBody PerfilDTO dto,
        HttpSession session) {
            String id = (String) session.getAttribute("usuarioId");
            if (id == null) throw new ApiException("Não autenticado", HttpStatus.UNAUTHORIZED);

            return ResponseEntity.ok(service.atualizarPerfil(id, dto));
    }

    // ── POST /usuarios/logout  →  Logout ─────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build(); // 204
    }
}