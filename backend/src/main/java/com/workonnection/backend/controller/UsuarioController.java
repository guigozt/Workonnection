package com.workonnection.backend.controller;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(
    origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
 }, 
 allowCredentials="true"
)
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // Cadastro
    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    // Login
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario dados, HttpSession session) {
        Optional<Usuario> usuario = repository.findByEmail(dados.getEmail());

        if (usuario.isPresent() && usuario.get().getSenha().equals(dados.getSenha())) {
            session.setAttribute("usuarioLogado", usuario.get());
            return usuario.get();
        }

        throw new RuntimeException("Email ou senha inválidos");
    }

    // Pega usuário logado
    @GetMapping("/me")
    public Usuario usuarioLogado(HttpSession session) {
        return (Usuario) session.getAttribute("usuarioLogado");
    }

    // Logout
    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }
}