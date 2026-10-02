package com.workonnection.backend.dto;

public record PerfilEstudanteDTO(
    String instituicaoEnsino,
    String curso,
    String semestreAno,
    String previsaoConclusao,
    String turno,
    String matricula,
    String modalidadeInteresse
) {}
