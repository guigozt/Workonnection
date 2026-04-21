package com.workonnection.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@Document(collection = "usuarios")
public class Usuario {

    @Id
    private String id;

    private String nome;
    private String cpf;
    private String dataNascimento;
    private String telefone;
    private String email;
    private String senha;
    private String tipoUsuario;

    // Campo embutido — salvo dentro do mesmo documento no MongoDB
    private Perfil perfil = new Perfil();

    // Notificações embutidas no documento do usuário (máx. 50 — as mais recentes)
    private List<Notificacao> notificacoes = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }

    public List<Notificacao> getNotificacoes() { return notificacoes; }
    public void setNotificacoes(List<Notificacao> n) { this.notificacoes = n; }

    // ── Classe interna Perfil ──────────────────────────────────────────────

    public static class Perfil {
        private String sobre;
        private String local;
        private String telefone;
        private String instagram;
        private String linkedin;
        private String site;
        private List<String> habilidades;
        private List<Map<String, Object>> formacoes;
        private List<Map<String, Object>> experiencias;
        private List<Map<String, Object>> cursos;

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

        public List<Map<String, Object>> getFormacoes() { return formacoes; }
        public void setFormacoes(List<Map<String, Object>> formacoes) { this.formacoes = formacoes; }

        public List<Map<String, Object>> getExperiencias() { return experiencias; }
        public void setExperiencias(List<Map<String, Object>> experiencias) { this.experiencias = experiencias; }

        public List<Map<String, Object>> getCursos() { return cursos; }
        public void setCursos(List<Map<String, Object>> cursos) { this.cursos = cursos; }
    }
}