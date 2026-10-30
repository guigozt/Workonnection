package com.workonnection.backend.dto;

import com.workonnection.backend.model.Feedback;

import java.time.Instant;
import java.util.List;

public class FeedbackResponseDTO {

    private String id;
    private String candidaturaId;
    private String vagaId;
    private String tituloVaga;
    private String autorId;
    private String autorNome;
    private String autorFotoUrl;
    private String autorTipo;
    private String destinatarioId;
    private String tipoAutor;
    private String decisao;
    private Integer notaGeral;

    // Campos do Contratante
    private String motivoPrincipal;
    private List<String> competenciasMelhoria;
    private List<String> pontosFortes;
    private String dicaConstrutiva;

    // Campos do Candidato
    private String avaliacaoProcesso;
    private String avaliacaoEmpresa;
    private Integer clarezaRequisitos;
    private Integer comunicacaoContratante;

    private Instant criadoEm;

    public FeedbackResponseDTO() {}

    public static FeedbackResponseDTO fromModel(Feedback f) {
        if (f == null) return null;
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(f.getId());
        dto.setCandidaturaId(f.getCandidaturaId());
        dto.setVagaId(f.getVagaId());
        dto.setTituloVaga(f.getTituloVaga());
        dto.setAutorId(f.getAutorId());
        dto.setAutorNome(f.getAutorNome());
        dto.setAutorFotoUrl(f.getAutorFotoUrl());
        dto.setAutorTipo(f.getAutorTipo());
        dto.setDestinatarioId(f.getDestinatarioId());
        dto.setTipoAutor(f.getTipoAutor());
        dto.setDecisao(f.getDecisao());
        dto.setNotaGeral(f.getNotaGeral());
        dto.setMotivoPrincipal(f.getMotivoPrincipal());
        dto.setCompetenciasMelhoria(f.getCompetenciasMelhoria());
        dto.setPontosFortes(f.getPontosFortes());
        dto.setDicaConstrutiva(f.getDicaConstrutiva());
        dto.setAvaliacaoProcesso(f.getAvaliacaoProcesso());
        dto.setAvaliacaoEmpresa(f.getAvaliacaoEmpresa());
        dto.setClarezaRequisitos(f.getClarezaRequisitos());
        dto.setComunicacaoContratante(f.getComunicacaoContratante());
        dto.setCriadoEm(f.getCriadoEm());
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCandidaturaId() {
        return candidaturaId;
    }

    public void setCandidaturaId(String candidaturaId) {
        this.candidaturaId = candidaturaId;
    }

    public String getVagaId() {
        return vagaId;
    }

    public void setVagaId(String vagaId) {
        this.vagaId = vagaId;
    }

    public String getTituloVaga() {
        return tituloVaga;
    }

    public void setTituloVaga(String tituloVaga) {
        this.tituloVaga = tituloVaga;
    }

    public String getAutorId() {
        return autorId;
    }

    public void setAutorId(String autorId) {
        this.autorId = autorId;
    }

    public String getAutorNome() {
        return autorNome;
    }

    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }

    public String getAutorFotoUrl() {
        return autorFotoUrl;
    }

    public void setAutorFotoUrl(String autorFotoUrl) {
        this.autorFotoUrl = autorFotoUrl;
    }

    public String getAutorTipo() {
        return autorTipo;
    }

    public void setAutorTipo(String autorTipo) {
        this.autorTipo = autorTipo;
    }

    public String getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(String destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public String getTipoAutor() {
        return tipoAutor;
    }

    public void setTipoAutor(String tipoAutor) {
        this.tipoAutor = tipoAutor;
    }

    public String getDecisao() {
        return decisao;
    }

    public void setDecisao(String decisao) {
        this.decisao = decisao;
    }

    public Integer getNotaGeral() {
        return notaGeral;
    }

    public void setNotaGeral(Integer notaGeral) {
        this.notaGeral = notaGeral;
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

    public String getAvaliacaoProcesso() {
        return avaliacaoProcesso;
    }

    public void setAvaliacaoProcesso(String avaliacaoProcesso) {
        this.avaliacaoProcesso = avaliacaoProcesso;
    }

    public String getAvaliacaoEmpresa() {
        return avaliacaoEmpresa;
    }

    public void setAvaliacaoEmpresa(String avaliacaoEmpresa) {
        this.avaliacaoEmpresa = avaliacaoEmpresa;
    }

    public Integer getClarezaRequisitos() {
        return clarezaRequisitos;
    }

    public void setClarezaRequisitos(Integer clarezaRequisitos) {
        this.clarezaRequisitos = clarezaRequisitos;
    }

    public Integer getComunicacaoContratante() {
        return comunicacaoContratante;
    }

    public void setComunicacaoContratante(Integer comunicacaoContratante) {
        this.comunicacaoContratante = comunicacaoContratante;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }
}
