package com.workonnection.backend.dto;

import com.workonnection.backend.model.Usuario;

// Retornado pela API — nunca inclui a senha.
public class UsuarioResponseDTO {

    private String id;
    private String nome;
    private String email;
    private String tipoUsuario;

    private Usuario.Perfil perfil;

    public UsuarioResponseDTO(String id, String nome, String email, String tipoUsuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
    }

    public UsuarioResponseDTO(String id, String nome, String email, String tipoUsuario, Usuario.Perfil perfil) {
        this(id, nome, email, tipoUsuario);
        this.perfil = perfil;
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTipoUsuario() { return tipoUsuario; }
    public Usuario.Perfil getPerfil() { return perfil; }
}