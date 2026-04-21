package com.workonnection.backend.model;

import java.time.Instant;

public class Notificacao {

    private String id;
    private String tipo;        // "like", "dislike", "comentario", "vaga_nova"
    private String mensagem;
    private String remetenteId;
    private String remetenteNome;
    private String vagaId;      // referência opcional à vaga relacionada
    private boolean lida;
    private Instant criadaEm;

    public Notificacao() {}

    public Notificacao(String id, String tipo, String mensagem,
                       String remetenteId, String remetenteNome,
                       String vagaId, Instant criadaEm) {
        this.id = id;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.remetenteId = remetenteId;
        this.remetenteNome = remetenteNome;
        this.vagaId = vagaId;
        this.lida = false;
        this.criadaEm = criadaEm;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public String getRemetenteId() { return remetenteId; }
    public void setRemetenteId(String remetenteId) { this.remetenteId = remetenteId; }

    public String getRemetenteNome() { return remetenteNome; }
    public void setRemetenteNome(String remetenteNome) { this.remetenteNome = remetenteNome; }

    public String getVagaId() { return vagaId; }
    public void setVagaId(String vagaId) { this.vagaId = vagaId; }

    public boolean isLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }

    public Instant getCriadaEm() { return criadaEm; }
    public void setCriadaEm(Instant criadaEm) { this.criadaEm = criadaEm; }
}