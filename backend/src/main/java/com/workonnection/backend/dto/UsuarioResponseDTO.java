package com.workonnection.backend.dto;

import com.workonnection.backend.model.Usuario;

public record UsuarioResponseDTO(
    String id,
    String nome,
    String email,
    String tipoUsuario,
    Usuario.Perfil perfil,
    long notificacoesNaoLidas,
    Usuario.Configuracoes configuracoes
) {}