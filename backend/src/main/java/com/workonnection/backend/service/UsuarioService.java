package com.workonnection.backend.service;

import com.workonnection.backend.dto.CadastroDTO;
import com.workonnection.backend.dto.ConfiguracoesDTO;
import com.workonnection.backend.dto.LoginDTO;
import com.workonnection.backend.dto.PerfilDTO;
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

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ── Cadastro ──────────────────────────────────────────────────────────────

    public UsuarioResponseDTO cadastrar(CadastroDTO dto) {
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ApiException("Email já cadastrado", HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setTelefone(dto.getTelefone());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(encoder.encode(dto.getSenha()));
        usuario.setTipoUsuario(dto.getTipoUsuario());

        Usuario salvo = repository.save(usuario);
        return toResponse(salvo);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public UsuarioResponseDTO login(LoginDTO dto) {
        Optional<Usuario> encontrado = repository.findByEmail(dto.getEmail());

        if (encontrado.isEmpty()) {
            throw new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED);
        }

        Usuario usuario = encontrado.get();

        if (!encoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED);
        }

        return toResponse(usuario);
    }

    // ── Busca por ID ──────────────────────────────────────────────────────────

    public UsuarioResponseDTO buscarPorId(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));
        return toResponse(usuario);
    }

    // ── Atualizar perfil ──────────────────────────────────────────────────────

    public UsuarioResponseDTO atualizarPerfil(String id, PerfilDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        // Atualiza o nome no documento principal se vier no DTO via perfil
        Usuario.Perfil perfil = new Usuario.Perfil();
        perfil.setSobre(dto.getSobre());
        perfil.setLocal(dto.getLocal());
        perfil.setTelefone(dto.getTelefone());
        perfil.setInstagram(dto.getInstagram());
        perfil.setLinkedin(dto.getLinkedin());
        perfil.setSite(dto.getSite());
        perfil.setHabilidades(dto.getHabilidades());
        perfil.setFormacoes(dto.getFormacoes() != null
                ? dto.getFormacoes().stream()
                    .map(o -> (java.util.Map<String, Object>) o)
                    .toList()
                : null);
        perfil.setExperiencias(dto.getExperiencias() != null
                ? dto.getExperiencias().stream()
                    .map(o -> (java.util.Map<String, Object>) o)
                    .toList()
                : null);
        perfil.setCursos(dto.getCursos() != null
                ? dto.getCursos().stream()
                    .map(o -> (java.util.Map<String, Object>) o)
                    .toList()
                : null);

        usuario.setPerfil(perfil);
        repository.save(usuario);
        return toResponse(usuario);
    }

    // ── Configurações ──────────────────────────────────────────────────────

    public UsuarioResponseDTO atualizarConfiguracoes(String id, ConfiguracoesDTO dto) {

        Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Usuario.Configuracoes config = usuario.getConfiguracoes();

        if (dto.getTema() != null) {
            config.setTema(dto.getTema());
        }

        if (dto.getIdioma() != null) {
            config.setIdioma(dto.getIdioma());
        }

        usuario.setConfiguracoes(config);
        repository.save(usuario);

        return toResponse(usuario);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    
    private UsuarioResponseDTO toResponse(Usuario u) {

        // Conta notificações não lidas
        long naoLidas = (u.getNotificacoes() == null) ? 0 :
                u.getNotificacoes().stream()
                        .filter(n -> !n.isLida())
                        .count();

        // Garante que o perfil nunca seja null
        Usuario.Perfil perfil = u.getPerfil();

        if (perfil == null) {
            perfil = new Usuario.Perfil();
        }

        // fallback - usa dados do cadastro se perfil estiver vazio
        if (perfil.getTelefone() == null || perfil.getTelefone().isEmpty()) {
            perfil.setTelefone(u.getTelefone());
        }

        return new UsuarioResponseDTO(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getTipoUsuario(),
                perfil,
                naoLidas,
                u.getConfiguracoes()
        );
    }
}