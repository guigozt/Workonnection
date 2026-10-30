package com.workonnection.backend.dto;

import com.workonnection.backend.model.FeedbackSelecao;
import com.workonnection.backend.model.StatusCandidatura;

import java.time.Instant;
import java.util.List;

public class CandidaturaResponseDTO {
    private String id;
    private String vagaId;
    private String candidatoId;
    private String tipoCandidato;
    private String contratanteId;
    private StatusCandidatura status;
    private String mensagemApresentacao;
    private FeedbackSelecao feedbackSelecao;
    private Instant criadaEm;
    private Instant atualizadaEm;

    // Dados complementares da Vaga
    private String vagaCargo;
    private String vagaEmpresa;
    private String vagaModalidade;
    private String vagaSalario;
    private String vagaLocalizacao;

    // Dados complementares do Candidato
    private String candidatoNome;
    private String candidatoEmail;
    private String candidatoFotoUrl;
    private List<String> candidatoHabilidades;
    private String candidatoSobre;

    public CandidaturaResponseDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVagaId() {
        return vagaId;
    }

    public void setVagaId(String vagaId) {
        this.vagaId = vagaId;
    }

    public String getCandidatoId() {
        return candidatoId;
    }

    public void setCandidatoId(String candidatoId) {
        this.candidatoId = candidatoId;
    }

    public String getTipoCandidato() {
        return tipoCandidato;
    }

    public void setTipoCandidato(String tipoCandidato) {
        this.tipoCandidato = tipoCandidato;
    }

    public String getContratanteId() {
        return contratanteId;
    }

    public void setContratanteId(String contratanteId) {
        this.contratanteId = contratanteId;
    }

    public StatusCandidatura getStatus() {
        return status;
    }

    public void setStatus(StatusCandidatura status) {
        this.status = status;
    }

    public String getMensagemApresentacao() {
        return mensagemApresentacao;
    }

    public void setMensagemApresentacao(String mensagemApresentacao) {
        this.mensagemApresentacao = mensagemApresentacao;
    }

    public FeedbackSelecao getFeedbackSelecao() {
        return feedbackSelecao;
    }

    public void setFeedbackSelecao(FeedbackSelecao feedbackSelecao) {
        this.feedbackSelecao = feedbackSelecao;
    }

    public Instant getCriadaEm() {
        return criadaEm;
    }

    public void setCriadaEm(Instant criadaEm) {
        this.criadaEm = criadaEm;
    }

    public Instant getAtualizadaEm() {
        return atualizadaEm;
    }

    public void setAtualizadaEm(Instant atualizadaEm) {
        this.atualizadaEm = atualizadaEm;
    }

    public String getVagaCargo() {
        return vagaCargo;
    }

    public void setVagaCargo(String vagaCargo) {
        this.vagaCargo = vagaCargo;
    }

    public String getVagaEmpresa() {
        return vagaEmpresa;
    }

    public void setVagaEmpresa(String vagaEmpresa) {
        this.vagaEmpresa = vagaEmpresa;
    }

    public String getVagaModalidade() {
        return vagaModalidade;
    }

    public void setVagaModalidade(String vagaModalidade) {
        this.vagaModalidade = vagaModalidade;
    }

    public String getVagaSalario() {
        return vagaSalario;
    }

    public void setVagaSalario(String vagaSalario) {
        this.vagaSalario = vagaSalario;
    }

    public String getVagaLocalizacao() {
        return vagaLocalizacao;
    }

    public void setVagaLocalizacao(String vagaLocalizacao) {
        this.vagaLocalizacao = vagaLocalizacao;
    }

    public String getCandidatoNome() {
        return candidatoNome;
    }

    public void setCandidatoNome(String candidatoNome) {
        this.candidatoNome = candidatoNome;
    }

    public String getCandidatoEmail() {
        return candidatoEmail;
    }

    public void setCandidatoEmail(String candidatoEmail) {
        this.candidatoEmail = candidatoEmail;
    }

    public String getCandidatoFotoUrl() {
        return candidatoFotoUrl;
    }

    public void setCandidatoFotoUrl(String candidatoFotoUrl) {
        this.candidatoFotoUrl = candidatoFotoUrl;
    }

    public List<String> getCandidatoHabilidades() {
        return candidatoHabilidades;
    }

    public void setCandidatoHabilidades(List<String> candidatoHabilidades) {
        this.candidatoHabilidades = candidatoHabilidades;
    }

    public String getCandidatoSobre() {
        return candidatoSobre;
    }

    public void setCandidatoSobre(String candidatoSobre) {
        this.candidatoSobre = candidatoSobre;
    }
}
