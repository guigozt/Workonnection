package com.workonnection.backend.dto;

public record CompletarCadastroDTO(
        String nome,
        String cpf,
        String dataNascimento,
        String telefone,
        String tipoUsuario
) {
}
