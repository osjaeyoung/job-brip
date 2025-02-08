package com.example.brip.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.brip.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
@Controller
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    SqlSession sqlSession;
    
    @Autowired
    private HttpSession httpSession;

   @Autowired
   private EmailService emailService;

    //회원가입: 닉네임 중복체크
    @PostMapping("/check-nickname")
    public ResponseEntity<Map<String, String>> checkNickname(@RequestBody Map<String, String> payload) {
       Map<String, String> response = new HashMap<>();
       try {
           String nickname = payload.get("nickname");
           
           // 닉네임 유효성 검사 
           if (nickname == null || nickname.length() < 2 || nickname.length() > 12 
               || !nickname.matches("^[a-zA-Z0-9가-힣]*$")) {
               response.put("result", "fail");
               response.put("message", "닉네임은 2~12자의 한글, 영문, 숫자만 가능합니다.");
               return ResponseEntity.ok(response);
           }
           
           Integer count = sqlSession.selectOne("user.countByNickname", nickname);
           if (count == 0) {
               response.put("result", "success");
               response.put("message", "사용 가능한 닉네임입니다.");
           } else {
               response.put("result", "fail"); 
               response.put("message", "이미 존재하는 닉네임입니다.");
           }
           return ResponseEntity.ok(response);
           
       } catch (Exception e) {
           response.put("result", "fail");
           response.put("message", "닉네임 확인 중 오류가 발생했습니다.");
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
       }
    }

    //회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, Object> userData) {
      Map<String, String> response = new HashMap<>();   
      try {
        // 이메일 중복 체크
        Integer emailCount = sqlSession.selectOne("user.countByEmail", userData.get("email"));
        if (emailCount > 0) {
            response.put("result", "fail");
            response.put("message", "이미 등록된 이메일입니다.");
            return ResponseEntity.ok(response);
        }

        // 비밀번호 암호화 - 디버깅
        String rawPassword = userData.get("password").toString();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(rawPassword);
        //System.out.println("Raw password: " + rawPassword);
        //System.out.println("Encoded password: " + encodedPassword);
         
        userData.put("password", encodedPassword);
        sqlSession.insert("user.insertUser", userData);
        response.put("result", "success");
        response.put("message", "회원가입이 완료되었습니다.");
        return ResponseEntity.ok(response);
        
      } catch (Exception e) {
        response.put("result", "fail");
        response.put("message", "회원가입 처리 중 오류가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
      }
    }    

    //로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, Object> loginData, HttpServletRequest request) {
      Map<String, String> response = new HashMap<>();
      
      try {
          String email = (String) loginData.get("email");
          String password = (String) loginData.get("password");

          // 이메일로 사용자 조회
          Map<String, Object> user = sqlSession.selectOne("user.getUserByEmail", email);
          
          if (user == null) {
              response.put("result", "fail");
              response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
              return ResponseEntity.ok(response);
          }

          // 비밀번호 검증
          BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
          if (!encoder.matches(password, (String) user.get("password"))) {
              response.put("result", "fail");
              response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
              return ResponseEntity.ok(response);
          }

          // 세션에 사용자 정보 저장
          //httpSession.setAttribute("userId", user.get("id"));
          //httpSession.setAttribute("email", user.get("email"));
          
          response.put("result", "success");
          response.put("message", "로그인 성공");
          response.put("userId", user.get("id").toString());
          response.put("email", user.get("email").toString());
          return ResponseEntity.ok(response);
          
      } catch (Exception e) {
          response.put("result", "fail");
          response.put("message", "로그인 처리 중 오류가 발생했습니다.");
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
      }
    }    

    //비번찾기 : 인증코드 발송
    @PostMapping("/send-verification")
    public ResponseEntity<Map<String, String>> sendVerification(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            emailService.sendVerificationEmail(email);
            
            response.put("result", "success");
            response.put("message", "인증코드가 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "인증코드 발송 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    // 비번찾기 : 인증코드 인증
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            String code = request.get("code");
 
            if (emailService.verifyCode(email, code)) {
                response.put("result", "success");
                response.put("message", "인증이 완료되었습니다.");
            } else {
                response.put("result", "fail");
                response.put("message", "잘못된 인증코드입니다.");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "인증 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }    
}
