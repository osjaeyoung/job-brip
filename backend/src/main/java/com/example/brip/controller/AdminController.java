package com.example.brip.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.brip.config.JwtTokenProvider;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/admin", produces = "application/json;charset=UTF-8")
@Tag(name = "Admin API", description = "관리자 관련 API")
public class AdminController {
    
    @Autowired
    SqlSession sqlSession;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 관리자 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, Object> loginData) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String adminId = (String) loginData.get("adminId");
            String password = (String) loginData.get("password");

            // 입력값 검증
            if (adminId == null || adminId.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "관리자 아이디를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (password == null || password.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 관리자 정보 조회
            Map<String, Object> admin = sqlSession.selectOne("org.mybatis.admin.getAdminById", adminId);
            
            if (admin == null) {
                response.put("result", "fail");
                response.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
                return ResponseEntity.ok(response);
            }

            // 비밀번호 검증
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (!encoder.matches(password, (String) admin.get("password"))) {
                response.put("result", "fail");
                response.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
                return ResponseEntity.ok(response);
            }

            // JWT 토큰 생성
            String token = jwtTokenProvider.generateAdminToken(admin.get("id").toString());

            response.put("result", "success");
            response.put("message", "로그인 성공");
            response.put("token", token);
            response.put("adminId", admin.get("admin_id").toString());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "로그인 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 관리자 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "이미 로그아웃된 상태입니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            response.put("result", "success");
            response.put("message", "로그아웃되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}