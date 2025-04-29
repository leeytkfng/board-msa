package com.example.userservice.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    public void sendAuthCode(String toEmail, String code){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[MyAPP] 이메일 인증번호");
        message.setText("인증번호는 ["+ code + "] 입니다. 유효시간은 5분입니다.");
        mailSender.send(message);
    }
}
