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
    private final EmailVerificationService emailVerificationService;

    public GoogleOAuthService(UsuarioRepository usuarioRepository,
                             EmailVerificationService emailVerificationService) {
        this.usuarioRepository = usuarioRepository;
        this.emailVerificationService = emailVerificationService;
    }

    /**
     * Called after successful OAuth2 authentication.
     * If a user with the Google email exists, returns it.
     * Otherwise creates a provisional user with emailVerified = false and sends verification code.
     */
    public Usuario processOAuth2User(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new IllegalArgumentException("Google account does not provide email");
        }
        Optional<Usuario> optional = usuarioRepository.findByEmail(email);
        if (optional.isPresent()) {
            Usuario existing = optional.get();
            // If user exists but hasn't verified email yet, resend verification code
            if (!existing.isEmailVerified()) {
                String newCode = emailVerificationService.generateAndSendCode(existing);
                existing.setVerificationCode(newCode);
                existing.setVerificationExpiry(java.time.Instant.now().plusSeconds(15 * 60));
                usuarioRepository.save(existing);
                return existing;
            }
            // If user is already verified but not yet linked to Google, link now
            if (!existing.isGoogleLinked()) {
                existing.setGoogleLinked(true);
                // Ensure google email is stored (already set)
                usuarioRepository.save(existing);
            }
            return existing;
        }
        // Create provisional user for first-time Google login
        Usuario provisional = new Usuario();
        provisional.setId(UUID.randomUUID().toString());
        provisional.setEmail(email);
        provisional.setEmailVerified(false);
        provisional.setGoogleLinked(false);
        // generate verification code and expiry
        String code = emailVerificationService.generateAndSendCode(provisional);
        provisional.setVerificationCode(code);
        provisional.setVerificationExpiry(java.time.Instant.now().plusSeconds(15 * 60)); // 15 min
        // Save provisional user (without password)
        return usuarioRepository.save(provisional);
    }

    /**
     * Completes registration after the user provides the verification code and the remaining data.
     */
    public Usuario confirmVerification(String email, String code, String nome, String cpf, String dataNascimento, String telefone, String tipoUsuario, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        if (usuario.isEmailVerified()) {
            throw new IllegalStateException("Email já verificado");
        }
        if (!code.equals(usuario.getVerificationCode()) ||
                usuario.getVerificationExpiry() == null ||
                usuario.getVerificationExpiry().isBefore(java.time.Instant.now())) {
            throw new IllegalArgumentException("Código de verificação inválido ou expirado");
        }
        // set remaining fields
        usuario.setNome(nome);
        usuario.setCpf(cpf);
        usuario.setDataNascimento(dataNascimento);
        usuario.setTelefone(telefone);
        usuario.setTipoUsuario(tipoUsuario);
        // password should be encoded – delegate to UsuarioService passwordEncoder later
        // Here we simply set raw password; real implementation should encode via PasswordEncoder.
        usuario.setSenha(senha);
        usuario.setEmailVerified(true);
        // Mark as linked to Google
        usuario.setGoogleLinked(true);
        // clear verification data
        usuario.setVerificationCode(null);
        usuario.setVerificationExpiry(null);
        return usuarioRepository.save(usuario);
    }
}
