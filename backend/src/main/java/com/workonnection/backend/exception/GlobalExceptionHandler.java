package com.workonnection.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// Intercepta qualquer ApiException lançada em qualquer controller/service
// e devolve um JSON { "erro": "mensagem" } com o status HTTP correto.
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, String>> handleApiException(ApiException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(Map.of("erro", ex.getMessage()));
    }

    // Captura genérica para erros inesperados (evita stack trace no frontend)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        return ResponseEntity
                .internalServerError()
                .body(Map.of("erro", "Erro interno no servidor"));
    }
}