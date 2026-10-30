package com.workonnection.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "candidaturas")
@CompoundIndexes({
    @CompoundIndex(name = "vaga_candidato_unica", def = "{'vagaId': 1, 'candidatoId': 1}", unique = true)
})
public class Candidatura {

    @Id
    private String id;

    @Indexed
    private String vagaId;

    @Indexed
    private String candidatoId;

    private String tipoCandidato; // "Estudante", "Microempreendedor", etc.

    @Indexed
    private String contratanteId;

    private StatusCandidatura status = StatusCandidatura.INSCRITO;

    private String mensagemApresentacao;

    private FeedbackSelecao feedbackSelecao;

    // Snapshot das informações da vaga caso a vaga seja encerrada/apagada
    private String vagaCargo;
    private String vagaEmpresa;
    private String vagaModalidade;
    private String vagaSalario;
    private String vagaLocalizacao;

    private Instant criadaEm = Instant.now();

    private Instant atualizadaEm = Instant.now();

    public Candidatura() {}

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
        this.atualizadaEm = Instant.now();
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
        this.atualizadaEm = Instant.now();
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
}
