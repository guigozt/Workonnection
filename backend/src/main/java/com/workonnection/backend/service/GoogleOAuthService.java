package com.workonnection.backend.service;

import com.workonnection.backend.model.Usuario;
import com.workonnection.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleOAuthService {

    private final UsuarioRepository usuarioRepository;
    private final RestTemplate restTemplate;

    public GoogleOAuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Valida o ID Token do Google via Google Tokeninfo API,
     * extrai os dados do perfil e cadastra ou recupera o usuário.
     */
    public Usuario verifyAndProcessToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token do Google não informado");
        }

        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
        Map<String, Object> payload;
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            payload = response;
        } catch (Exception e) {
            throw new IllegalArgumentException("Token do Google inválido ou expirado: " + e.getMessage());
        }

        if (payload == null || !payload.containsKey("email")) {
            throw new IllegalArgumentException("Não foi possível obter o email a partir do token do Google");
        }

        String email = (String) payload.get("email");
        String name = (String) payload.get("name");

        Optional<Usuario> optional = usuarioRepository.findByEmail(email);
        if (optional.isPresent()) {
            Usuario existing = optional.get();
            boolean changed = false;
            if (!existing.isGoogleLinked()) {
                existing.setGoogleLinked(true);
                changed = true;
            }
            if (!existing.isEmailVerified()) {
                existing.setEmailVerified(true);
                changed = true;
            }
            if ((existing.getNome() == null || existing.getNome().isBlank()) && name != null) {
                existing.setNome(name);
                changed = true;
            }
            if (changed) {
                return usuarioRepository.save(existing);
            }
            return existing;
        }

        // Cria usuário diretamente a partir dos dados do Google
        Usuario novo = new Usuario();
        novo.setId(UUID.randomUUID().toString());
        novo.setEmail(email);
        novo.setNome(name != null && !name.isBlank() ? name : email);
        novo.setEmailVerified(true);
        novo.setGoogleLinked(true);
        novo.setTipoUsuario("Estudante");

        return usuarioRepository.save(novo);
    }
}
