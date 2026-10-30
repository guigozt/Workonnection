package com.workonnection.backend.repository;

import com.workonnection.backend.model.Feedback;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {

    List<Feedback> findByDestinatarioIdOrderByCriadoEmDesc(String destinatarioId);

    List<Feedback> findByDestinatarioIdOrderByCriadoEmDesc(String destinatarioId, Pageable pageable);

    List<Feedback> findByAutorIdOrderByCriadoEmDesc(String autorId);

    List<Feedback> findByCandidaturaId(String candidaturaId);

    Optional<Feedback> findByCandidaturaIdAndAutorId(String candidaturaId, String autorId);

    boolean existsByCandidaturaIdAndAutorId(String candidaturaId, String autorId);
}
