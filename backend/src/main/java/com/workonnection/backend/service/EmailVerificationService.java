package com.workonnection.backend.service;

import com.workonnection.backend.model.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    @Value("${spring.mail.username:workonnection.fatec@gmail.com}")
    private String remetente;

    public EmailVerificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Generates a verification code, stores it in the user (via setters) and sends an email.
     * Returns the generated code.
     */
    public String generateAndSendCode(Usuario user) {
        // simple 6-digit numeric code
        int codeInt = 100000 + random.nextInt(900000);
        String code = String.valueOf(codeInt);
        user.setVerificationCode(code);
        user.setVerificationExpiry(java.time.Instant.now().plusSeconds(15 * 60));

        try {
            logger.info("Enviando código de verificação para o e-mail: {}", user.getEmail());
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(user.getEmail());
            message.setSubject("Código de verificação Workonnection");
            message.setText("Seu código de verificação é: " + code + "\n\nEle expira em 15 minutos.");
            mailSender.send(message);
            logger.info("E-mail de verificação enviado com sucesso para: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Erro ao enviar e-mail de verificação para {}: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Não foi possível enviar o e-mail com o código de verificação. Verifique se o endereço é válido ou tente novamente.", e);
        }

        return code;
    }
}
