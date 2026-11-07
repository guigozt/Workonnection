package com.workonnection.backend.dto;

public record CadastroDTO(
    String nome,
    String cpf,
    String dataNascimento,
    String telefone,
    String email,
    String senha,
    String tipoUsuario
) {
    // Construtor de compatibilidade para código/testes legados sem senha
    public CadastroDTO(String nome, String cpf, String dataNascimento, String telefone, String email, String tipoUsuario) {
        this(nome, cpf, dataNascimento, telefone, email, null, tipoUsuario);
    }
}
