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
                // Arquivos estáticos e páginas
                .requestMatchers(
                    "/",
                    "/modules/**",
                    "/css/**",
                    "/js/**",
                    "/imagens/**",
                    "/favicon.ico"
                ).permitAll()

                // Rotas públicas
                .requestMatchers(
                    "/usuarios",
                    "/usuarios/login"
                ).permitAll()

                // TODO: futuramente trocar pra authenticated()
                .anyRequest().permitAll()
            )

            // 🔥 LOGOUT FUNCIONANDO
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    res.setStatus(200);
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }
}