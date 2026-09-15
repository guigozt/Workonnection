package com.workonnection.backend.service;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleOAuthService {

    private final UsuarioRepository usuarioRepository;

    public GoogleOAuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Called after successful OAuth2 authentication.
     * If a user with the Google email exists, returns it.
     * Otherwise creates a provisional user.
     */
    public Usuario processOAuth2User(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new IllegalArgumentException("Google account does not provide email");
        }
        Optional<Usuario> optional = usuarioRepository.findByEmail(email);
        if (optional.isPresent()) {
            Usuario existing = optional.get();
            // If user is already verified but not yet linked to Google, link now
            if (!existing.isGoogleLinked()) {
                existing.setGoogleLinked(true);
                usuarioRepository.save(existing);
            }
            return existing;
        }
        // Create provisional user for first-time Google login
        Usuario provisional = new Usuario();
        provisional.setId(UUID.randomUUID().toString());
        provisional.setEmail(email);
        provisional.setEmailVerified(true);
        provisional.setGoogleLinked(true);
        // Save provisional user (without password)
        return usuarioRepository.save(provisional);
    }

    /**
     * Completes registration after the user provides the remaining data.
     */
    public Usuario confirmVerification(String email, String nome, String cpf, String dataNascimento, String telefone, String tipoUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        // set remaining fields
        usuario.setNome(nome);
        usuario.setCpf(cpf);
        usuario.setDataNascimento(dataNascimento);
        usuario.setTelefone(telefone);
        usuario.setTipoUsuario(tipoUsuario);
        
        // Mark as verified and linked
        usuario.setEmailVerified(true);
        usuario.setGoogleLinked(true);
        
        return usuarioRepository.save(usuario);
    }
}
