package com.workonnection.backend.model;

import java.time.Instant;

public class Comentario {

    private String id;
    private String usuarioId;
    private String nomeUsuario;
    private String texto;
    private Instant criadoEm;

    public Comentario() {}

    public Comentario(String id, String usuarioId, String nomeUsuario, String texto, Instant criadoEm) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nomeUsuario = nomeUsuario;
        this.texto = texto;
        this.criadoEm = criadoEm;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
}