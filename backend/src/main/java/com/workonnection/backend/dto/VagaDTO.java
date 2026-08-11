package com.workonnection.backend.dto;

import java.util.List;

public record VagaDTO(
    String empresa,
    String cargo,
    String descricao,
    String modalidade,
    String horario,
    String beneficios,
    String localizacao,
    String salario,
    String data,
    String requisitos,
    String email,
    List<String> tiposUsuario
) {}
