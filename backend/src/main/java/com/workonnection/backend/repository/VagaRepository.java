package com.workonnection.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.workonnection.backend.model.Vaga;

public interface VagaRepository extends MongoRepository<Vaga, String> {

    List<Vaga> findByUsuarioId(String usuarioId);

}