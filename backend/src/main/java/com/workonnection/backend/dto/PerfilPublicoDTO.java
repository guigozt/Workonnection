package com.workonnection.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO para exibição pública de perfil (LGPD).
 * Não inclui informações sensíveis como telefone.
 */
public record PerfilPublicoDTO(
    String sobre,
    String local,
    String instagram,
    String linkedin,
    String site,
    List<String> habilidades,
    List<Map<String, Object>> formacoes,
    List<Map<String, Object>> experiencias,
    List<Map<String, Object>> cursos
) {}
