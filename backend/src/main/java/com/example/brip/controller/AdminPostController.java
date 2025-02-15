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
@RequestMapping(value = "/api/admin/post", produces = "application/json;charset=UTF-8")
@Tag(name = "Admin Post API", description = "관리자용 게시글 관리 API")
public class AdminPostController {

    @Autowired
    SqlSession sqlSession;

    // 신고된 게시글 목록 조회
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReportList(
            @RequestParam(required = false) String status,
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
            params.put("status", status);
            params.put("sort", sort);

            List<Map<String, Object>> reports = sqlSession.selectList("org.mybatis.adminPost.getReportList", params);
            response.put("result", "success");
            response.put("data", reports);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "신고 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 신고 상세 조회
    @GetMapping("/reports/{reportId}")
    public ResponseEntity<Map<String, Object>> getReportDetail(
            @PathVariable Long reportId,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> report = sqlSession.selectOne("org.mybatis.adminPost.getReportDetail", reportId);
            
            if (report == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 신고입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("data", report);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "신고 상세 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 신고 처리하기
    @PostMapping("/reports/{reportId}/process")
    public ResponseEntity<Map<String, String>> processReport(
            @PathVariable Long reportId,
            @RequestBody Map<String, String> processData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String status = processData.get("status");
            if (status == null || (!status.equals("PROCESSED") && !status.equals("REJECTED"))) {
                response.put("result", "fail");
                response.put("message", "올바른 처리 상태를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> params = new HashMap<>();
            params.put("reportId", reportId);
            params.put("status", status);
            
            int updatedRows = sqlSession.update("org.mybatis.adminPost.updateReportStatus", params);
            
            if (updatedRows == 0) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 신고입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // 신고가 승인된 경우 게시글 삭제 처리
            if (status.equals("PROCESSED")) {
                sqlSession.update("org.mybatis.adminPost.deleteReportedPost", reportId);
            }

            response.put("result", "success");
            response.put("message", "신고가 처리되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "신고 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}