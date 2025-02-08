package com.example.brip.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Service
public class EmailService {
   @Autowired
   private JavaMailSender mailSender;
   private Map<String, VerificationInfo> verificationMap = new ConcurrentHashMap<>();

   public void sendVerificationEmail(String email) {
       int code = new Random().nextInt(900000) + 100000;
       verificationMap.put(email, new VerificationInfo(code, LocalDateTime.now().plusMinutes(3)));

       SimpleMailMessage message = new SimpleMailMessage();
       message.setTo(email);
       message.setSubject("인증 코드");
       message.setText("인증 코드: " + code);
       //메일코드 폼 입혀야함
       //....
       
       mailSender.send(message);
   }

   public boolean verifyCode(String email, String code) {
       VerificationInfo info = verificationMap.get(email);
       return info != null && 
              info.getCode() == Integer.parseInt(code) && 
              LocalDateTime.now().isBefore(info.getExpireTime());
   }
}

@Data
@AllArgsConstructor
class VerificationInfo {
   private int code;
   private LocalDateTime expireTime;
}