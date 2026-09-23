package com.workonnection.backend.service;

import com.workonnection.backend.model.Usuario;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class EmailVerificationService {

    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

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
        // send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Código de verificação Workonnection");
        message.setText("Seu código de verificação é: " + code + "\nEle expira em 15 minutos.");
        mailSender.send(message);
        return code;
    }
}
