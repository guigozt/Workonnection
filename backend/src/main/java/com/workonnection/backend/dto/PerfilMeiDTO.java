package com.workonnection.backend.dto;

public record PerfilMeiDTO(
    String cnpj,
    String razaoSocial,
    String nomeFantasia,
    String ocupacaoPrincipal,
    String chavePix,
    String inscricaoMunicipal,
    Boolean emiteNotaFiscal
) {}
