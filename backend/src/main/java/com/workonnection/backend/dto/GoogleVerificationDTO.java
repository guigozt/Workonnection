package com.workonnection.backend.dto;

/**
 * DTO for completing registration after Google OAuth login.
 */
public record GoogleVerificationDTO(
        String email,
        String nome,
        String cpf,
        String dataNascimento,
        String telefone,
        String tipoUsuario
) {
}
