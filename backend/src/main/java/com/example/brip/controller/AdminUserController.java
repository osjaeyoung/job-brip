package com.example.brip.controller;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/admin/user", produces = "application/json;charset=UTF-8")
@Tag(name = "Admin User API", description = "관리자용 회원 관리 API")
public class AdminUserController {

    @Autowired
    SqlSession sqlSession;

    // 회원 목록 조회
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getUserList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "latest") String sort,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> params = new HashMap<>();
            params.put("search", search);
            params.put("sort", sort);

            List<Map<String, Object>> users = sqlSession.selectList("org.mybatis.adminUser.getUserList", params);
            response.put("result", "success");
            response.put("data", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "회원 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회원 상세 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetail(
            @PathVariable Long userId,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> user = sqlSession.selectOne("org.mybatis.adminUser.getUserDetail", userId);
            
            if (user == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 회원입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("data", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "회원 정보 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회원 정보 수정
    @PostMapping("/update/{userId}")
    public ResponseEntity<Map<String, String>> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> userData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 필수 필드 검증
            String[] requiredFields = {"name", "nickname", "phone", "birthDate"};
            for (String field : requiredFields) {
                if (userData.get(field) == null || userData.get(field).toString().trim().isEmpty()) {
                    response.put("result", "fail");
                    response.put("message", field + "은(는) 필수 입력값입니다.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            userData.put("userId", userId);
            int updatedRows = sqlSession.update("org.mybatis.adminUser.updateUser", userData);
            
            if (updatedRows == 0) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 회원입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("message", "회원 정보가 수정되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "회원 정보 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}