package com.workonnection.backend.dto;

public class CandidaturaCreateDTO {
    private String mensagemApresentacao;

    public CandidaturaCreateDTO() {}

    public CandidaturaCreateDTO(String mensagemApresentacao) {
        this.mensagemApresentacao = mensagemApresentacao;
    }

    public String getMensagemApresentacao() {
        return mensagemApresentacao;
    }

    public void setMensagemApresentacao(String mensagemApresentacao) {
        this.mensagemApresentacao = mensagemApresentacao;
    }
}
