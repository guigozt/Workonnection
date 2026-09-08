package com.workonnection.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.workonnection.backend.service.GoogleOAuthService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.userdetails.UserDetails;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository,
            GoogleOAuthService googleOAuthService
    ) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .securityContext(security -> security
                    .securityContextRepository(securityContextRepository)
                )
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/google/**").permitAll()
                    .requestMatchers("/", "/modules/**", "/css/**", "/js/**", "/global/**", "/imagens/**", "/favicon.ico", "/oauth2/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                    .requestMatchers("/usuarios/login", "/usuarios/logout").permitAll()
                    .requestMatchers(HttpMethod.GET, "/vagas/**").permitAll()
                    .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo
                        .userService(oAuth2UserService(googleOAuthService))
                    )
                );

        return http.build();
    }

    @Bean
    public OAuth2UserService<org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest, org.springframework.security.oauth2.core.user.OAuth2User> oAuth2UserService(GoogleOAuthService googleOAuthService) {
        return userRequest -> {
            org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService delegate = new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService();
            org.springframework.security.oauth2.core.user.OAuth2User oAuth2User = delegate.loadUser(userRequest);
            // Process user with our service (create provisional user and send verification email)
            googleOAuthService.processOAuth2User(oAuth2User);
            return oAuth2User;
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "https://workonnection-frontend.vercel.app",
            "https://*.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Permite o envio de cookies de sessão

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}