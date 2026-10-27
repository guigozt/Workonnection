package com.workonnection.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "feedbacks")
@CompoundIndexes({
    @CompoundIndex(name = "feedback_candidatura_autor", def = "{'candidaturaId': 1, 'autorId': 1}", unique = true)
})
public class Feedback {

    @Id
    private String id;

    @Indexed
    private String candidaturaId;

    @Indexed
    private String vagaId;

    private String tituloVaga;

    @Indexed
    private String autorId;

    private String autorNome;
    private String autorFotoUrl;
    private String autorTipo; // ex: Estudante, Empresa, MEI

    @Indexed
    private String destinatarioId;

    private String tipoAutor; // "CONTRATANTE" ou "CANDIDATO"
    private String decisao; // "ACEITO" ou "RECUSADO"

    // Avaliação numérica geral (1 a 5 estrelas)
    private Integer notaGeral;

    // Campos do Contratante (motivos, pontos fortes, oportunidades de melhoria)
    private String motivoPrincipal;
    private List<String> competenciasMelhoria = new ArrayList<>();
    private List<String> pontosFortes = new ArrayList<>();
    private String dicaConstrutiva;

    // Campos do Candidato/Contratado (avaliação sobre a empresa, processo seletivo, ambiente/comunicação)
    private String avaliacaoProcesso; // Comentário sobre o processo seletivo
    private String avaliacaoEmpresa;  // Comentário sobre a empresa/contratante
    private Integer clarezaRequisitos; // Nota 1 a 5
    private Integer comunicacaoContratante; // Nota 1 a 5

    private Instant criadoEm = Instant.now();

    public Feedback() {}

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
        this.competenciasMelhoria = competenciasMelhoria != null ? competenciasMelhoria : new ArrayList<>();
    }

    public List<String> getPontosFortes() {
        return pontosFortes;
    }

    public void setPontosFortes(List<String> pontosFortes) {
        this.pontosFortes = pontosFortes != null ? pontosFortes : new ArrayList<>();
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
