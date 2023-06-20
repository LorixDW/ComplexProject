package com.complex.server.utils;

import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailUtil {
    @Autowired
    public JavaMailSender mailSender;
    private final Character[] chars = new Character[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'};
    private final int codeLength = 8;
    public void SendMessage(String email, String subject, String message){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
    public String CheckCodeGenerate(){
        StringBuilder res = new StringBuilder();
        for (int i = 0; i < 8; i++){
            res.append(chars[(int) (Math.random() * chars.length)]);
        }
        return res.toString();
    }
}
