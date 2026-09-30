package com.workonnection.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "mensagens")
public class Mensagem {

    @Id
    private String id;
    private String remetenteId;
    private String destinatarioId;
    private String conteudo;
    private Instant dataEnvio = Instant.now();
    private boolean lida = false;
    private Instant dataLeitura;
    private boolean editada = false;
    private Instant dataEdicao;
    private List<String> excluidaPara = new ArrayList<>();

    public Mensagem() {
    }

    public Mensagem(String remetenteId, String destinatarioId, String conteudo) {
        this.remetenteId = remetenteId;
        this.destinatarioId = destinatarioId;
        this.conteudo = conteudo;
        this.dataEnvio = Instant.now();
        this.lida = false;
        this.editada = false;
        this.excluidaPara = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRemetenteId() {
        return remetenteId;
    }

    public void setRemetenteId(String remetenteId) {
        this.remetenteId = remetenteId;
    }

    public String getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(String destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Instant getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(Instant dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public boolean isLida() {
        return lida;
    }

    public void setLida(boolean lida) {
        this.lida = lida;
    }

    public Instant getDataLeitura() {
        return dataLeitura;
    }

    public void setDataLeitura(Instant dataLeitura) {
        this.dataLeitura = dataLeitura;
    }

    public boolean isEditada() {
        return editada;
    }

    public void setEditada(boolean editada) {
        this.editada = editada;
    }

    public Instant getDataEdicao() {
        return dataEdicao;
    }

    public void setDataEdicao(Instant dataEdicao) {
        this.dataEdicao = dataEdicao;
    }

    public List<String> getExcluidaPara() {
        if (excluidaPara == null) {
            excluidaPara = new ArrayList<>();
        }
        return excluidaPara;
    }

    public void setExcluidaPara(List<String> excluidaPara) {
        this.excluidaPara = excluidaPara;
    }
}