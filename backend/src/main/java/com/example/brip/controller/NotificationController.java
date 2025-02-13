package com.example.brip.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.brip.config.JwtTokenProvider;
import com.example.brip.service.EmailService;
import com.example.brip.util.FileUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private SqlSession sqlSession;
    
    // 알림 목록 조회
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getNotifications(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            List<Map<String, Object>> notifications = sqlSession.selectList(
                "org.mybatis.notification.getNotifications", 
                userId
            );
            
            response.put("result", "success");
            response.put("data", notifications);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "알림 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 알림 읽음 처리
    @PostMapping("/read/{notificationId}")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable int notificationId,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            Map<String, Object> params = new HashMap<>();
            params.put("notificationId", notificationId);
            params.put("userId", userId);
            
            sqlSession.update("org.mybatis.notification.markAsRead", params);
            
            response.put("result", "success");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "알림 읽음 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "전체 알림 읽음 처리", description = "사용자의 모든 알림을 읽음 상태로 변경합니다.")
    @PostMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // 전체 읽음 처리
            sqlSession.update("org.mybatis.notification.markAllAsRead", userId);
            
            response.put("result", "success");
            response.put("message", "모든 알림이 읽음 처리되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "알림 전체 읽음 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }    
}