package com.workonnection.backend.model;

public class PerfilEstudante {

    private String instituicaoEnsino;
    private String curso;
    private String semestreAno;
    private String previsaoConclusao;
    private String turno; // Manhã, Tarde, Noite, Integral, EAD
    private String matricula;
    private String modalidadeInteresse; // Estágio, CLT, Remoto, Híbrido, Presencial

    public PerfilEstudante() {}

    public String getInstituicaoEnsino() {
        return instituicaoEnsino;
    }

    public void setInstituicaoEnsino(String instituicaoEnsino) {
        this.instituicaoEnsino = instituicaoEnsino;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getSemestreAno() {
        return semestreAno;
    }

    public void setSemestreAno(String semestreAno) {
        this.semestreAno = semestreAno;
    }

    public String getPrevisaoConclusao() {
        return previsaoConclusao;
    }

    public void setPrevisaoConclusao(String previsaoConclusao) {
        this.previsaoConclusao = previsaoConclusao;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getModalidadeInteresse() {
        return modalidadeInteresse;
    }

    public void setModalidadeInteresse(String modalidadeInteresse) {
        this.modalidadeInteresse = modalidadeInteresse;
    }
}
