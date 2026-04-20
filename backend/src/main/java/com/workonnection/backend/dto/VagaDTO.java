package com.workonnection.backend.dto;

import java.util.List;

public class VagaDTO {

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
    private List<String> tiposUsuario;

    // getters e setters

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getModalidade() { return modalidade; }
    public void setModalidade(String modalidade) { this.modalidade = modalidade; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public String getBeneficios() { return beneficios; }
    public void setBeneficios(String beneficios) { this.beneficios = beneficios; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public String getSalario() { return salario; }
    public void setSalario(String salario) { this.salario = salario; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<String> getTiposUsuario() { return tiposUsuario; }
    public void setTiposUsuario(List<String> tiposUsuario) { this.tiposUsuario = tiposUsuario; }
}