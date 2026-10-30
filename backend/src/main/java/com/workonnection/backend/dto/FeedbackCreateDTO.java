package com.workonnection.backend.dto;

import java.util.List;

public class FeedbackCreateDTO {

    // Avaliação 1 a 5 estrelas
    private Integer notaGeral;

    // Campos do Contratante
    private String motivoPrincipal;
    private List<String> competenciasMelhoria;
    private List<String> pontosFortes;
    private String dicaConstrutiva;

    // Campos do Candidato / Contratado
    private String avaliacaoProcesso;
    private String avaliacaoEmpresa;
    private Integer clarezaRequisitos;
    private Integer comunicacaoContratante;

    public FeedbackCreateDTO() {}

    public Integer getNotaGeral() {
        return notaGeral;
    }

    public void setNotaGeral(Integer notaGeral) {
        this.notaGeral = notaGeral;
    }

    public String getMotivoPrincipal() {
        return motivoPrincipal;
    }

    public void setMotivoPrincipal(String motivoPrincipal) {
        this.motivoPrincipal = motivoPrincipal;
    }

    public List<String> getCompetenciasMelhoria() {
        return competenciasMelhoria;
    }

    public void setCompetenciasMelhoria(List<String> competenciasMelhoria) {
        this.competenciasMelhoria = competenciasMelhoria;
    }

    public List<String> getPontosFortes() {
        return pontosFortes;
    }

    public void setPontosFortes(List<String> pontosFortes) {
        this.pontosFortes = pontosFortes;
    }

    public String getDicaConstrutiva() {
        return dicaConstrutiva;
    }

    public void setDicaConstrutiva(String dicaConstrutiva) {
        this.dicaConstrutiva = dicaConstrutiva;
    }

    public String getAvaliacaoProcesso() {
        return avaliacaoProcesso;
    }

    public void setAvaliacaoProcesso(String avaliacaoProcesso) {
        this.avaliacaoProcesso = avaliacaoProcesso;
    }

    public String getAvaliacaoEmpresa() {
        return avaliacaoEmpresa;
    }

    public void setAvaliacaoEmpresa(String avaliacaoEmpresa) {
        this.avaliacaoEmpresa = avaliacaoEmpresa;
    }

    public Integer getClarezaRequisitos() {
        return clarezaRequisitos;
    }

    public void setClarezaRequisitos(Integer clarezaRequisitos) {
        this.clarezaRequisitos = clarezaRequisitos;
    }

    public Integer getComunicacaoContratante() {
        return comunicacaoContratante;
    }

    public void setComunicacaoContratante(Integer comunicacaoContratante) {
        this.comunicacaoContratante = comunicacaoContratante;
    }
}
