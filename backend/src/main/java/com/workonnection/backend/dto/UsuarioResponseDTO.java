package com.workonnection.backend.dto;

// Esse DTO é o que a API retorna ao frontend.
// A senha nunca é incluída na resposta.
public class UsuarioResponseDTO {

    private String id;
    private String nome;
    private String email;
    private String tipoUsuario;

    public UsuarioResponseDTO(String id, String nome, String email, String tipoUsuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTipoUsuario() { return tipoUsuario; }
}