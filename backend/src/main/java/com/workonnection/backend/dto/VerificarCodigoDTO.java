package com.workonnection.backend.dto;

public record VerificarCodigoDTO(
    String email,
    String codigo,
    String novaSenha
) {
    public VerificarCodigoDTO(String email, String codigo) {
        this(email, codigo, null);
    }
}
