package com.workonnection.backend.dto;

/**
 * DTO para exibição pública de usuário (LGPD).
 * Contém apenas identificação pública e o perfil público.
 * Não inclui email, telefone, cpf, data de nascimento, senha ou configurações.
 */
public record UsuarioPublicoDTO(
    String id,
    String nome,
    String tipoUsuario,
    PerfilPublicoDTO perfil
) {}
