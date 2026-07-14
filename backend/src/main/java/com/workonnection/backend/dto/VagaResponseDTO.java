package com.workonnection.backend.dto;

import com.workonnection.backend.model.Comentario;
import java.util.List;

public record VagaResponseDTO(

    String id;
    String nomeUsuario;
    String empresa;
    String cargo;
    String descricao;
    String modalidade;
    String horario;
    String beneficios;
    String localizacao;
    String salario;
    String data;
    String requisitos;
    String email;
    String usuarioId;
    List<String> tiposUsuario;
    List<String> likes;
    List<String> dislikes;
    List<Comentario> comentarios;
) {}
