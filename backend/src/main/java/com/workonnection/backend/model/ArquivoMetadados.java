package com.workonnection.backend.model;

import java.time.Instant;

public class ArquivoMetadados {

    private String id;
    private String tipoDocumento; // ex: "FOTO_PERFIL", "COMPROVANTE_MATRICULA", "CCMEI", "CARTAO_CNPJ", "CONTRATO_SOCIAL", etc.
    private String nomeOriginal;
    private String contentType;
    private long tamanhoBytes;
    private String url;
    private Instant enviadoEm = Instant.now();

    public ArquivoMetadados() {}

    public ArquivoMetadados(String id, String tipoDocumento, String nomeOriginal, String contentType, long tamanhoBytes, String url) {
        this.id = id;
        this.tipoDocumento = tipoDocumento;
        this.nomeOriginal = nomeOriginal;
        this.contentType = contentType;
        this.tamanhoBytes = tamanhoBytes;
        this.url = url;
        this.enviadoEm = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNomeOriginal() {
        return nomeOriginal;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getTamanhoBytes() {
        return tamanhoBytes;
    }

    public void setTamanhoBytes(long tamanhoBytes) {
        this.tamanhoBytes = tamanhoBytes;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Instant getEnviadoEm() {
        return enviadoEm;
    }

    public void setEnviadoEm(Instant enviadoEm) {
        this.enviadoEm = enviadoEm;
    }
}
