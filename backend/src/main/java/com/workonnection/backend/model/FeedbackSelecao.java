package com.workonnection.backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class FeedbackSelecao {
    private String motivoPrincipal;
    private List<String> competenciasMelhoria = new ArrayList<>();
    private List<String> pontosFortes = new ArrayList<>();
    private String dicaConstrutiva;
    private Instant enviadoEm;

    public FeedbackSelecao() {}

    public FeedbackSelecao(String motivoPrincipal, List<String> competenciasMelhoria, List<String> pontosFortes, String dicaConstrutiva) {
        this.motivoPrincipal = motivoPrincipal;
        this.competenciasMelhoria = competenciasMelhoria != null ? competenciasMelhoria : new ArrayList<>();
        this.pontosFortes = pontosFortes != null ? pontosFortes : new ArrayList<>();
        this.dicaConstrutiva = dicaConstrutiva;
        this.enviadoEm = Instant.now();
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

    public Instant getEnviadoEm() {
        return enviadoEm;
    }

    public void setEnviadoEm(Instant enviadoEm) {
        this.enviadoEm = enviadoEm;
    }
}
