package com.workonnection.backend.dto;

import java.time.Instant;

public record MensagemResponseDTO(
    String id,
    String remetenteId,
    String destinatarioId,
    String conteudo,
    Instant dataEnvio,
    boolean lida,
    Instant dataLeitura,
    boolean editada
) {}