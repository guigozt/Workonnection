package com.workonnection.backend.repository;

import com.workonnection.backend.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findFirstByEmail(String email);

    Optional<Usuario> findFirstByCpf(String cpf);

    @Query("{ '$or': [ { 'cpf': ?0 }, { 'cpf': ?1 } ] }")
    Optional<Usuario> findFirstByCpfVariants(String rawCpf, String formattedCpf);
}