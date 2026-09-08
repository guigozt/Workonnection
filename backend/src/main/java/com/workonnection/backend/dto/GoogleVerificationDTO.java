package com.workonnection.backend.dto;

/**
 * DTO for completing registration after Google OAuth login and email verification.
 */
public record GoogleVerificationDTO(
        String email,
        String code,
        String nome,
        String cpf,
        String dataNascimento,
        String telefone,
        String tipoUsuario,
        String senha
) {
}
