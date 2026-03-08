package com.example.backend.services;

import com.example.backend.enums.TokenType;
import com.example.backend.models.Token;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import org.thymeleaf.context.Context;

@Service//
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private SpringTemplateEngine templateEngine;

    public void sendConfirmationEmail(String destino, Token token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        String link = "http://localhost:8080/auth/confirm?token="+ token.getToken();

        Context context = new Context();
        context.setVariable("confirmationLink",link);
        String html = templateEngine.process("email",context);

        helper.setTo(destino);
        helper.setSubject("Confirmação de e-mail");
        helper.setText(html,true);
        mailSender.send(message);

        System.out.println("Email enviado para: "+destino);
    }
}
