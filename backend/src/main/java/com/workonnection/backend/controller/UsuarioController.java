package com.workonnection.backend.controller;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    //Cadastro
    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    //Login
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario dados) {

        Optional<Usuario> usuario = repository.findByEmail(dados.getEmail());

        if (usuario.isPresent() && usuario.get().getSenha().equals(dados.getSenha())) {
            return usuario.get();
        }

        throw new RuntimeException("Email ou senha inválidos");
    }
}