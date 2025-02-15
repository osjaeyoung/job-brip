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
@RequestMapping(value = "/api/admin/board", produces = "application/json;charset=UTF-8")
@Tag(name = "Admin Board API", description = "관리자용 게시판 API")
public class AdminBoardController {

    @Autowired
    SqlSession sqlSession;

    // 공지사항 목록 조회
    @GetMapping("/notice/list")
    public ResponseEntity<Map<String, Object>> getNoticeList(
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

            List<Map<String, Object>> notices = sqlSession.selectList("org.mybatis.adminBoard.getNoticeList", params);
            response.put("result", "success");
            response.put("data", notices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "공지사항 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 공지사항 등록
    @PostMapping("/notice/create")
    public ResponseEntity<Map<String, String>> createNotice(
            @RequestBody Map<String, String> noticeData,
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
            if (noticeData.get("title") == null || noticeData.get("title").trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "제목을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            if (noticeData.get("content") == null || noticeData.get("content").trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            sqlSession.insert("org.mybatis.adminBoard.insertNotice", noticeData);
            response.put("result", "success");
            response.put("message", "공지사항이 등록되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "공지사항 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 공지사항 수정
    @PostMapping("/notice/update/{noticeId}")
    public ResponseEntity<Map<String, String>> updateNotice(
            @PathVariable Long noticeId,
            @RequestBody Map<String, String> noticeData,
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
            if (noticeData.get("title") == null || noticeData.get("title").trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "제목을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            if (noticeData.get("content") == null || noticeData.get("content").trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            noticeData.put("noticeId", noticeId.toString());
            int updatedRows = sqlSession.update("org.mybatis.adminBoard.updateNotice", noticeData);
            
            if (updatedRows == 0) {
                response.put("result", "fail");
                response.put("message", "해당 공지사항이 존재하지 않습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("message", "공지사항이 수정되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "공지사항 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 문의 목록 조회
    @GetMapping("/inquiry/list")
    public ResponseEntity<Map<String, Object>> getInquiryList(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            List<Map<String, Object>> inquiries = sqlSession.selectList("org.mybatis.adminBoard.getInquiryList");
            response.put("result", "success");
            response.put("data", inquiries);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "문의 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 문의 답변 등록
    @PostMapping("/inquiry/answer/{inquiryId}")
    public ResponseEntity<Map<String, String>> answerInquiry(
            @PathVariable Long inquiryId,
            @RequestBody Map<String, String> answerData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (answerData.get("answer") == null || answerData.get("answer").trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "답변 내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> params = new HashMap<>();
            params.put("inquiryId", inquiryId);
            params.put("answer", answerData.get("answer"));

            int updatedRows = sqlSession.update("org.mybatis.adminBoard.updateInquiryAnswer", params);
            
            if (updatedRows == 0) {
                response.put("result", "fail");
                response.put("message", "해당 문의가 존재하지 않습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("message", "답변이 등록되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "답변 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 문의 상세 조회
    @GetMapping("/inquiry/{inquiryId}")
    public ResponseEntity<Map<String, Object>> getInquiryDetail(
            @PathVariable Long inquiryId,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminId = (String) request.getAttribute("userId");
            if (adminId == null) {
                response.put("result", "fail");
                response.put("message", "관리자 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> inquiry = sqlSession.selectOne("org.mybatis.adminBoard.getInquiryDetail", inquiryId);
            
            if (inquiry == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 문의입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("data", inquiry);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "문의 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }    
}