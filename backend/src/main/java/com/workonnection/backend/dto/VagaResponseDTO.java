package com.workonnection.backend.dto;

public class VagaResponseDTO {

    private String id;
    private String empresa;
    private String cargo;
    private String descricao;
    private String modalidade;
    private String horario;
    private String beneficios;
    private String localizacao;
    private String salario;
    private String data;
    private String requisitos;
    private String email;
    private String usuarioId;

    public VagaResponseDTO(String id, String empresa, String cargo, String descricao,
                           String modalidade, String horario, String beneficios,
                           String localizacao, String salario, String data,
                           String requisitos, String email, String usuarioId) {
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.descricao = descricao;
        this.modalidade = modalidade;
        this.horario = horario;
        this.beneficios = beneficios;
        this.localizacao = localizacao;
        this.salario = salario;
        this.data = data;
        this.requisitos = requisitos;
        this.email = email;
        this.usuarioId = usuarioId;
    }

    // getters

    public String getId() { return id; }
    public String getEmpresa() { return empresa; }
    public String getCargo() { return cargo; }
    public String getDescricao() { return descricao; }
    public String getModalidade() { return modalidade; }
    public String getHorario() { return horario; }
    public String getBeneficios() { return beneficios; }
    public String getLocalizacao() { return localizacao; }
    public String getSalario() { return salario; }
    public String getData() { return data; }
    public String getRequisitos() { return requisitos; }
    public String getEmail() { return email; }
    public String getUsuarioId() { return usuarioId; }
}