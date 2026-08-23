package com.workonnection.backend.controller;

import com.workonnection.backend.dto.CadastroDTO;
import com.workonnection.backend.dto.ConfiguracoesDTO;
import com.workonnection.backend.dto.LoginDTO;
import com.workonnection.backend.dto.PerfilDTO;
import com.workonnection.backend.dto.UsuarioResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;

import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;
    private final SecurityContextRepository securityContextRepository;

    public UsuarioController(
            UsuarioService service,
            SecurityContextRepository securityContextRepository
    ) {
        this.service = service;
        this.securityContextRepository = securityContextRepository;
    }

    /**
     * Lista todos os usuários.
     */
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(
            service.listarColaboradores()
        );
    }

    /**
     * Cadastro.
     */
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(
            @RequestBody CadastroDTO dto
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.cadastrar(dto));
    }

    /**
     * Login.
     */
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(
            @RequestBody LoginDTO dto,
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session
    ) {

        UsuarioResponseDTO usuario = service.login(dto);

        /*
         * Guarda o ID do usuário na sessão.
         */
        session.setAttribute(
            "usuarioId",
            usuario.id()
        );

        /*
         * Cria a autenticação do Spring Security.
         */
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                usuario.email(),
                null,
                Collections.emptyList()
            );

        /*
         * Cria um novo SecurityContext.
         */
        SecurityContext context =
            SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        /*
         * Coloca o contexto no SecurityContextHolder.
         */
        SecurityContextHolder.setContext(context);

        /*
         * IMPORTANTE:
         * Salva o SecurityContext na HttpSession.
         */
        securityContextRepository.saveContext(
            context,
            request,
            response
        );

        return ResponseEntity.ok(usuario);
    }

    /**
     * Retorna o usuário atualmente logado.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> usuarioLogado(
            HttpSession session
    ) {

        String id = getLoggerUserId(session);

        return ResponseEntity.ok(
            service.buscarPorId(id)
        );
    }

    /**
     * Atualiza perfil.
     */
    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
            @RequestBody PerfilDTO dto,
            HttpSession session
    ) {

        String id = getLoggerUserId(session);

        return ResponseEntity.ok(
            service.atualizarPerfil(id, dto)
        );
    }

    /**
     * Atualiza configurações.
     */
    @PutMapping("/configuracoes")
    public ResponseEntity<UsuarioResponseDTO> atualizarConfiguracoes(
            @RequestBody ConfiguracoesDTO dto,
            HttpSession session
    ) {

        String id = getLoggerUserId(session);

        return ResponseEntity.ok(
            service.atualizarConfiguracoes(id, dto)
        );
    }

    /**
     * Retorna o ID do usuário logado.
     */
    private String getLoggerUserId(HttpSession session) {

        if (session == null) {
            throw new ApiException(
                "Não autenticado",
                HttpStatus.UNAUTHORIZED
            );
        }

        String id =
            (String) session.getAttribute("usuarioId");

        if (id == null || id.isBlank()) {
            throw new ApiException(
                "Não autenticado",
                HttpStatus.UNAUTHORIZED
            );
        }

        return id;
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            session.invalidate();
        }
        
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}
