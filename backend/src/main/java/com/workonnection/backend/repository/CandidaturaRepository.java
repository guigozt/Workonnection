package com.workonnection.backend.repository;

import com.workonnection.backend.model.Candidatura;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidaturaRepository extends MongoRepository<Candidatura, String> {

    List<Candidatura> findByCandidatoId(String candidatoId);

    List<Candidatura> findByContratanteId(String contratanteId);

    List<Candidatura> findByContratanteIdAndVagaId(String contratanteId, String vagaId);

    List<Candidatura> findByVagaId(String vagaId);

    Optional<Candidatura> findByVagaIdAndCandidatoId(String vagaId, String candidatoId);

    boolean existsByVagaIdAndCandidatoId(String vagaId, String candidatoId);
}
