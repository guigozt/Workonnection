package com.workonnection.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "vagas")
public class Vaga {

    @Id
    private String id;

    private String nomeUsuario;
    private String empresa;
    private String cargo;
    private String descricao;
    private String modalidade;
    private String horario;
    private String beneficios;
    private String localizacao;
    private String salario;
    private String data;
    private String requisitos;
    private String email;
    // 🔥 vínculo com usuário
    private String usuarioId;

    //Valores possíveis: "todos/estudantes"
    private List<String> tiposUsuario;

    //Comentários
    private List<String> likes = new ArrayList<>();
    private List<String> dislikes = new ArrayList<>();
    private List<Comentario> comentarios = new ArrayList<>();

    // getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getModalidade() { return modalidade; }
    public void setModalidade(String modalidade) { this.modalidade = modalidade; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public String getBeneficios() { return beneficios; }
    public void setBeneficios(String beneficios) { this.beneficios = beneficios; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public String getSalario() { return salario; }
    public void setSalario(String salario) { this.salario = salario; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }

    public List<String> getTiposUsuario() { return tiposUsuario; }
    public void setTiposUsuario(List<String> tiposUsuario) { this.tiposUsuario = tiposUsuario; }

        public List<String> getLikes() { return likes; }
    public void setLikes(List<String> l) { this.likes = l; }
 
    public List<String> getDislikes() { return dislikes; }
    public void setDislikes(List<String> d) { this.dislikes = d; }
 
    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> c) { this.comentarios = c; }
}