package com.workonnection.backend.dto;

public record PerfilMeDTO(
    String cnpj,
    String razaoSocial,
    String nomeFantasia,
    String cnaePrincipal,
    String inscricaoEstadual,
    String inscricaoMunicipal,
    String regimeTributario,
    String porteEmpresa,
    Integer quantidadeFuncionarios
) {}
