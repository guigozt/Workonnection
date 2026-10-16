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
}
