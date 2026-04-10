package com.workonnection.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Libera todos os recursos estáticos e páginas HTML
                .requestMatchers(
                    "/",
                    "/modules/**",
                    "/css/**",
                    "/js/**",
                    "/imagens/**",
                    "/favicon.ico"
                ).permitAll()

                // Rotas públicas da API de autenticação
                .requestMatchers(
                    "/usuarios",
                    "/usuarios/login"
                ).permitAll()

                // Todo o resto também liberado por ora
                // Quando quiser proteger a API, troque por .authenticated()
                .anyRequest().permitAll()
            );

        // NÃO configure authenticationEntryPoint aqui.
        // O redirect para login é responsabilidade do auth.js no frontend,
        // não do Spring. Se o Spring redirecionar, ele intercepta o HTML
        // antes do browser carregar e quebra a navegação.

        return http.build();
    }
}