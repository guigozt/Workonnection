package com.workonnection.backend.service;

import com.workonnection.backend.dto.*;
import com.workonnection.backend.exception.ApiException;
import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
        this.encoder = new BCryptPasswordEncoder();
    }

    public UsuarioResponseDTO cadastrar(CadastroDTO dto) {
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ApiException("Email já cadastrado", HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setCpf(dto.cpf());
        usuario.setDataNascimento(dto.dataNascimento());
        usuario.setTelefone(dto.telefone());
        usuario.setEmail(dto.email());
        usuario.setSenha(encoder.encode(dto.senha()));
        usuario.setTipoUsuario(dto.tipoUsuario());

        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO login(LoginDTO dto) {
        Usuario usuario = repository.findByEmail(dto.email())
                .orElseThrow(() -> new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED));

        if (!encoder.matches(dto.senha(), usuario.getSenha())) {
            throw new ApiException("Email ou senha inválidos", HttpStatus.UNAUTHORIZED);
        }

        return toResponse(usuario);
    }

    public UsuarioResponseDTO buscarPorId(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));
        return toResponse(usuario);
    }

    public List<UsuarioResponseDTO> listarColaboradores() {
        return repository.findAll().stream()
                .filter(u -> u != null)
                .map(this::toResponse)
                .toList();
    }

    @SuppresWarning("unchecked")
    public UsuarioResponseDTO atualizarPerfil(String id, PerfilDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Usuario.Perfil perfil = new Usuario.Perfil();
        perfil.setSobre(dto.sobre());
        perfil.setLocal(dto.local());
        perfil.setTelefone(dto.telefone());
        perfil.setInstagram(dto.instagram());
        perfil.setLinkedin(dto.linkedin());
        perfil.setSite(dto.site());
        perfil.setHabilidades(dto.habilidades());
        perfil.setFormacoes(dto.formacoes() != null ? dto.formacoes().stream().map(o -> (java.util.Map<String, Object>) o).toList() : null);
        perfil.setExperiencias(dto.experiencias() != null ? dto.experiencias().stream().map(o -> (java.util.Map<String, Object>) o).toList() : null);
        perfil.setCursos(dto.cursos() != null ? dto.cursos().stream().map(o -> (java.util.Map<String, Object>) o).toList() : null);

        usuario.setPerfil(perfil);
        return toResponse(repository.save(usuario));
    }

    public UsuarioResponseDTO atualizarConfiguracoes(String id, ConfiguracoesDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ApiException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        Usuario.Configuracoes config = usuario.getConfiguracoes() != null ? usuario.getConfiguracoes() : new Usuario.Configuracoes();

        if (dto.getTema() != null) config.setTema(dto.getTema());
        if (dto.getIdioma() != null) config.setIdioma(dto.getIdioma());

        usuario.setConfiguracoes(config);
        return toResponse(repository.save(usuario));
    }

    private UsuarioResponseDTO toResponse(Usuario u) {
        long naoLidas = (u.getNotificacoes() == null) ? 0 : u.getNotificacoes().stream().filter(n -> !n.isLida()).count();
        Usuario.Perfil perfil = u.getPerfil() != null ? u.getPerfil() : new Usuario.Perfil();
        
        if (perfil.getTelefone() == null || perfil.getTelefone().isEmpty()) {
            perfil.setTelefone(u.getTelefone());
        }

        Usuario.Configuracoes config = u.getConfiguracoes() != null ? u.getConfiguracoes() : new Usuario.Configuracoes();

        return new UsuarioResponseDTO(
                u.getId(), u.getNome(), u.getEmail(), u.getTipoUsuario(), perfil, naoLidas, config
        );
    }
}