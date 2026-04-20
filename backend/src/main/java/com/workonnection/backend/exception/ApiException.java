package com.workonnection.backend.exception;

import org.springframework.http.HttpStatus;

// Exceção customizada que carrega o status HTTP correto.
// Usada no Service para lançar erros semânticos (ex: 401, 409).
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String mensagem, HttpStatus status) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}