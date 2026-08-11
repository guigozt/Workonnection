package com.workonnection.backend.dto;

import java.util.List;
import java.util.Map;

public record PerfilDTO(
    String sobre,
    String local,
    String telefone,
    String instagram,
    String linkedin,
    String site,
    List<String> habilidades,
    List<Map<String, Object>> formacoes,
    List<Map<String, Object>> experiencias,
    List<Map<String, Object>> cursos
) {}