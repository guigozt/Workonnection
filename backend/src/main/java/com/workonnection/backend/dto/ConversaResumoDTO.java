package com.workonnection.backend.dto;

public record ConversaResumoDTO(
    UsuarioPublicoDTO contato,
    MensagemResponseDTO ultimaMensagem,
    long naoLidasCount
) {}
