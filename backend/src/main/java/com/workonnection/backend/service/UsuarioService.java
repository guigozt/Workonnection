package com.workonnection.backend.service;

import com.workonnection.backend.dto.CadastroDTO;
import com.workonnection.backend.dto.LoginDTO;
import com.workonnection.backend.dto.UsuarioResponseDTO;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    // BCrypt para hash de senha. Nunca salve senha em texto puro.
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ── Cadastro ──────────────────────────────────────────────────────────────

    public UsuarioResponseDTO cadastrar(CadastroDTO dto) {

        // Verifica se já existe usuário com esse email
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ApiException("Email já cadastrado", HttpStatus.CONFLICT); // 409
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setTelefone(dto.getTelefone());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(encoder.encode(dto.getSenha())); // hash aqui
        usuario.setTipoUsuario(dto.getTipoUsuario());

        Usuario salvo = repository.save(usuario);
        return toResponse(salvo);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public UsuarioResponseDTO login(LoginDTO dto) {
        Optional<Usuario> encontrado = repository.findByEmail(dto.getEmail());

        // Mesma mensagem para email e senha: não revela qual está errado
        if (encontrado.isEmpty()) {
            throw new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED); // 401
        }

        Usuario usuario = encontrado.get();

        if (!encoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED); // 401
        }

        return toResponse(usuario);
    }

    // ── Busca por ID (para sessão) ────────────────────────────────────────────

    public UsuarioResponseDTO buscarPorId(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));
        return toResponse(usuario);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    // Converte entidade → DTO de resposta (sem senha)
    private UsuarioResponseDTO toResponse(Usuario u) {
        return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getTipoUsuario());
    }
}