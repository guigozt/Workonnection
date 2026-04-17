package com.workonnection.backend.dto;

import java.util.List;

public class PerfilDTO {
    private String sobre;
    private String local;
    private String telefone;
    private String instagram;
    private String linkedin;
    private String site;
    private List<String> habilidades;
    private List<Object> formacoes;
    private List<Object> experiencias;
    private List<Object> cursos;

    public String getSobre() { return sobre; }
    public void setSobre(String sobre) { this.sobre = sobre; }
 
    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }
 
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
 
    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
 
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
 
    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }
 
    public List<String> getHabilidades() { return habilidades; }
    public void setHabilidades(List<String> habilidades) { this.habilidades = habilidades; }
 
    public List<Object> getFormacoes() { return formacoes; }
    public void setFormacoes(List<Object> formacoes) { this.formacoes = formacoes; }
 
    public List<Object> getExperiencias() { return experiencias; }
    public void setExperiencias(List<Object> experiencias) { this.experiencias = experiencias; }
 
    public List<Object> getCursos() { return cursos; }
    public void setCursos(List<Object> cursos) { this.cursos = cursos; }
}