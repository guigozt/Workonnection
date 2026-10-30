package com.workonnection.backend.dto;

import java.util.List;

public class FeedbackRecusaDTO {
    private String motivoPrincipal;
    private List<String> competenciasMelhoria;
    private List<String> pontosFortes;
    private String dicaConstrutiva;

    public FeedbackRecusaDTO() {}

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
}
