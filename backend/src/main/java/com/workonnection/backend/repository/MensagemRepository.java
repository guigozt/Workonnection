package com.workonnection.backend.repository;

import com.workonnection.backend.model.Mensagem;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends MongoRepository<Mensagem, String> {

    @Query("{ '$or': [ { 'remetenteId': ?0, 'destinatarioId': ?1 }, { 'remetenteId': ?1, 'destinatarioId': ?0 } ] }")
    List<Mensagem> findHistoricoEntreUsuarios(String u1, String u2, Sort sort);

    List<Mensagem> findByDestinatarioIdAndRemetenteIdAndLidaFalse(String destinatarioId, String remetenteId);

    long countByDestinatarioIdAndRemetenteIdAndLidaFalse(String destinatarioId, String remetenteId);

    long countByDestinatarioIdAndLidaFalse(String destinatarioId);

    @Query("{ '$or': [ { 'remetenteId': ?0 }, { 'destinatarioId': ?0 } ] }")
    List<Mensagem> findAllByUsuarioId(String usuarioId, Sort sort);
}
