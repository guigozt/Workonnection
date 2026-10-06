package com.workonnection.backend.repository;

import com.workonnection.backend.model.Mensagem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends MongoRepository<Mensagem, String> {

    @Query("{ '$or': [ " +
            "{ 'remetenteId': ?0, 'destinatarioId': ?1 }, " +
            "{ 'remetenteId': ?1, 'destinatarioId': ?0 } " +
            "], 'excluidaPara': { '$ne': ?0 } }")
    List<Mensagem> findHistoricoSemExcluidas(String usuarioId, String contatoId);

    List<Mensagem> findByRemetenteIdAndDestinatarioIdAndLidaFalse(String remetenteId, String destinatarioId);

    long countByDestinatarioIdAndLidaFalseAndExcluidaParaNotContaining(String destinatarioId, String usuarioId);
}