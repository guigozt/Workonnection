package com.workonnection.backend.model;

public class PerfilEmpresa {

    private String cnpj;
    private String razaoSocial;
    private String nomeFantasia;
    private String setorAtuacao; // Tecnologia, Varejo, Saúde, Educação, etc.
    private String tamanhoEmpresa; // 1-10, 11-50, 51-200, 201-500, 500+
    private String siteOficial;
    private String paginaCarreiras;
    private String contatoRhEmail;
    private String contatoRhTelefone;

    public PerfilEmpresa() {}

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getSetorAtuacao() {
        return setorAtuacao;
    }

    public void setSetorAtuacao(String setorAtuacao) {
        this.setorAtuacao = setorAtuacao;
    }

    public String getTamanhoEmpresa() {
        return tamanhoEmpresa;
    }

    public void setTamanhoEmpresa(String tamanhoEmpresa) {
        this.tamanhoEmpresa = tamanhoEmpresa;
    }

    public String getSiteOficial() {
        return siteOficial;
    }

    public void setSiteOficial(String siteOficial) {
        this.siteOficial = siteOficial;
    }

    public String getPaginaCarreiras() {
        return paginaCarreiras;
    }

    public void setPaginaCarreiras(String paginaCarreiras) {
        this.paginaCarreiras = paginaCarreiras;
    }

    public String getContatoRhEmail() {
        return contatoRhEmail;
    }

    public void setContatoRhEmail(String contatoRhEmail) {
        this.contatoRhEmail = contatoRhEmail;
    }

    public String getContatoRhTelefone() {
        return contatoRhTelefone;
    }

    public void setContatoRhTelefone(String contatoRhTelefone) {
        this.contatoRhTelefone = contatoRhTelefone;
    }
}
