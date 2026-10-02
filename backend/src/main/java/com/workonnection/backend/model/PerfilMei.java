package com.workonnection.backend.model;

public class PerfilMei {

    private String cnpj;
    private String razaoSocial;
    private String nomeFantasia;
    private String ocupacaoPrincipal; // CNAE/Ocupação MEI
    private String chavePix;
    private String inscricaoMunicipal;
    private Boolean emiteNotaFiscal;

    public PerfilMei() {}

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

    public String getOcupacaoPrincipal() {
        return ocupacaoPrincipal;
    }

    public void setOcupacaoPrincipal(String ocupacaoPrincipal) {
        this.ocupacaoPrincipal = ocupacaoPrincipal;
    }

    public String getChavePix() {
        return chavePix;
    }

    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
    }

    public String getInscricaoMunicipal() {
        return inscricaoMunicipal;
    }

    public void setInscricaoMunicipal(String inscricaoMunicipal) {
        this.inscricaoMunicipal = inscricaoMunicipal;
    }

    public Boolean getEmiteNotaFiscal() {
        return emiteNotaFiscal;
    }

    public void setEmiteNotaFiscal(Boolean emiteNotaFiscal) {
        this.emiteNotaFiscal = emiteNotaFiscal;
    }
}
