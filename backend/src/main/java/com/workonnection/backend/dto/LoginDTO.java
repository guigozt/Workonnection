package com.workonnection.backend.dto;

public record LoginDTO(
    String email,
    String senha
) {
    // Construtor de compatibilidade para código/testes legados sem senha
    public LoginDTO(String email) {
        this(email, null);
    }
}
