package com.workonnection.backend.repository;

import com.workonnection.backend.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findFirstByEmail(String email);

    List<Usuario> findByCpf(String cpf);

    List<Usuario> findByCpfIn(java.util.Collection<String> cpfs);

    @Query("{ '$or': [ { 'cpf': ?0 }, { 'cpf': ?1 } ] }")
    List<Usuario> findByCpfVariants(String rawCpf, String formattedCpf);
}