package com.workonnection.backend.service;

import com.workonnection.backend.model.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.time.Duration;

@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();
    private final HttpClient httpClient;

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.from-email:Workonnection <onboarding@resend.dev>}")
    private String resendFromEmail;

    @Value("${spring.mail.username:workonnection.fatec@gmail.com}")
    private String remetenteSmtp;

    public EmailVerificationService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Generates a verification code, stores it in the user (via setters) and sends
     * an email.
     * Returns the generated code.
     */
    public String generateAndSendCode(Usuario user) {
        // simple 6-digit numeric code
        int codeInt = 100000 + random.nextInt(900000);
        String code = String.valueOf(codeInt);
        user.setVerificationCode(code);
        user.setVerificationExpiry(java.time.Instant.now().plusSeconds(15 * 60));

        // Prioriza Resend via HTTP (porta 443) caso a chave esteja presente (necessário
        // em nuvens como o Render)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            enviarViaResend(user.getEmail(), code);
        } else if (mailSender != null) {
            enviarViaSmtp(user.getEmail(), code);
        } else {
            logger.warn("Nenhum provedor de e-mail configurado (Resend API Key ou SMTP ausentes).");
        }

        return code;
    }

    private void enviarViaResend(String emailDestino, String code) {
        try {
            logger.info("Enviando código de verificação via Resend HTTP API para: {}", emailDestino);

            String subject = "Código de verificação Workonnection";
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>"
                    + "<h2 style='color: #2563eb;'>Workonnection</h2>"
                    + "<p>Seu código de verificação de segurança é:</p>"
                    + "<div style='background-color: #f1f5f9; padding: 16px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #1e293b; margin: 20px 0;'>"
                    + code
                    + "</div>"
                    + "<p style='color: #64748b; font-size: 14px;'>Este código é válido por <strong>15 minutos</strong>. Se você não solicitou este código, por favor ignore este e-mail.</p>"
                    + "</div>";

            // Monta o JSON para a API do Resend
            String jsonPayload = String.format(
                    "{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\"}",
                    resendFromEmail.replace("\"", "\\\""),
                    emailDestino.replace("\"", "\\\""),
                    subject.replace("\"", "\\\""),
                    htmlContent.replace("\"", "\\\""));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("E-mail de verificação enviado com sucesso pelo Resend para: {}. Resposta: {}",
                        emailDestino, response.body());
            } else {
                logger.error("Falha ao enviar e-mail via Resend. Status: {}, Resposta: {}", response.statusCode(),
                        response.body());
                throw new RuntimeException(
                        "Falha na API do Resend (" + response.statusCode() + "): " + response.body());
            }
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail via Resend para {}: {}", emailDestino, e.getMessage(), e);
            throw new RuntimeException("Não foi possível enviar o e-mail de verificação: " + e.getMessage(), e);
        }
    }

    private void enviarViaSmtp(String emailDestino, String code) {
        try {
            logger.info("Enviando código de verificação via SMTP para: {}", emailDestino);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetenteSmtp);
            message.setTo(emailDestino);
            message.setSubject("Código de verificação Workonnection");
            message.setText("Seu código de verificação é: " + code + "\n\nEle expira em 15 minutos.");
            mailSender.send(message);
            logger.info("E-mail de verificação enviado com sucesso via SMTP para: {}", emailDestino);
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail via SMTP para {}: {}", emailDestino, e.getMessage(), e);
            throw new RuntimeException(
                    "Não foi possível enviar o e-mail com o código de verificação via SMTP: " + e.getMessage(), e);
        }
    }
}
