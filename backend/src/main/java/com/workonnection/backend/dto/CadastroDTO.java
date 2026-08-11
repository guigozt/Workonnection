package com.workonnection.backend.dto;

public record CadastroDTO(
    String nome,
    String cpf,
    String dataNascimento,
    String telefone,
    String email,
    String senha,
    String tipoUsuario
) {}
