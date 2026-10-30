package com.workonnection.backend.dto;

public class StatusFeedbackCandidaturaDTO {

    private boolean contratanteEnviou;
    private boolean candidatoEnviou;
    private FeedbackResponseDTO meuFeedback;
    private FeedbackResponseDTO feedbackRecebido;

    public StatusFeedbackCandidaturaDTO() {}

    public StatusFeedbackCandidaturaDTO(boolean contratanteEnviou, boolean candidatoEnviou, FeedbackResponseDTO meuFeedback, FeedbackResponseDTO feedbackRecebido) {
        this.contratanteEnviou = contratanteEnviou;
        this.candidatoEnviou = candidatoEnviou;
        this.meuFeedback = meuFeedback;
        this.feedbackRecebido = feedbackRecebido;
    }

    public boolean isContratanteEnviou() {
        return contratanteEnviou;
    }

    public void setContratanteEnviou(boolean contratanteEnviou) {
        this.contratanteEnviou = contratanteEnviou;
    }

    public boolean isCandidatoEnviou() {
        return candidatoEnviou;
    }

    public void setCandidatoEnviou(boolean candidatoEnviou) {
        this.candidatoEnviou = candidatoEnviou;
    }

    public FeedbackResponseDTO getMeuFeedback() {
        return meuFeedback;
    }

    public void setMeuFeedback(FeedbackResponseDTO meuFeedback) {
        this.meuFeedback = meuFeedback;
    }

    public FeedbackResponseDTO getFeedbackRecebido() {
        return feedbackRecebido;
    }

    public void setFeedbackRecebido(FeedbackResponseDTO feedbackRecebido) {
        this.feedbackRecebido = feedbackRecebido;
    }
}
