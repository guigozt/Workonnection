package com.workonnection.backend.dto;

public record PerfilEmpresaDTO(
    String cnpj,
    String razaoSocial,
    String nomeFantasia,
    String setorAtuacao,
    String tamanhoEmpresa,
    String siteOficial,
    String paginaCarreiras,
    String contatoRhEmail,
    String contatoRhTelefone
) {}
