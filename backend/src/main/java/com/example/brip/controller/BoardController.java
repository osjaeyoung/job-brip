package com.example.brip.controller;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RestController
@RequestMapping(value = "/api/board", produces = "application/json;charset=UTF-8")
@Tag(name = "Board API", description = "공지사항과 1:1문의 관련 API")
public class BoardController {

    @Autowired
    SqlSession sqlSession;

    // 공지사항 목록 조회
    @GetMapping("/notice/list")
    public ResponseEntity<Map<String, Object>> getNoticeList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "latest") String sort) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("search", search);
            params.put("sort", sort);

            List<Map<String, Object>> notices = sqlSession.selectList("org.mybatis.board.getNoticeList", params);
            response.put("result", "success");
            response.put("data", notices);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "공지사항 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 공지사항 상세 조회
    @GetMapping("/notice/{noticeId}")
    public ResponseEntity<Map<String, Object>> getNoticeDetail(@PathVariable Long noticeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> notice = sqlSession.selectOne("org.mybatis.board.getNoticeDetail", noticeId);
            response.put("result", "success");
            response.put("data", notice);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "공지사항 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 1:1 문의 등록
    @PostMapping(value = "/inquiry/create", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> createInquiry(
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            HttpServletRequest request) {
        
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 이미지 검증
            if (images != null) {
                if (images.length > 3) {
                    return ResponseEntity.badRequest().body(Map.of("result", "fail", 
                        "message", "이미지는 최대 3장까지 업로드 가능합니다."));
                }

                for (MultipartFile image : images) {
                    if (image.getSize() > 5 * 1024 * 1024) {
                        return ResponseEntity.badRequest().body(Map.of("result", "fail", 
                            "message", "이미지 크기는 5MB를 초과할 수 없습니다."));
                    }

                    // String originalFilename = image.getOriginalFilename();
                    // if (originalFilename == null) {
                    //     return ResponseEntity.badRequest().body(Map.of("result", "fail", 
                    //         "message", "파일 이름이 없습니다."));
                    // }

                    // String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
                    // if (!extension.equals("jpg") && !extension.equals("jpeg") && !extension.equals("png")) {
                    //     return ResponseEntity.badRequest().body(Map.of("result", "fail", 
                    //         "message", "JPG, PNG 형식의 이미지만 업로드 가능합니다."));
                    // }
                }
            }

            // 문의 데이터 준비
            Map<String, Object> inquiryData = new HashMap<>();
            inquiryData.put("userId", userId);
            inquiryData.put("category", category);
            inquiryData.put("title", title);
            inquiryData.put("content", content);

            // 이미지 업로드 및 URL 저장
            if (images != null) {
                for (int i = 0; i < images.length; i++) {
                    String imageUrl = uploadImage(images[i]);
                    inquiryData.put("imageUrl" + (i + 1), imageUrl);
                }
            }

            sqlSession.insert("org.mybatis.board.insertInquiry", inquiryData);
            
            response.put("result", "success");
            response.put("message", "문의가 등록되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "문의 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 문의 목록 조회
    @GetMapping("/inquiry/list")
    public ResponseEntity<Map<String, Object>> getInquiryList(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            List<Map<String, Object>> inquiries = sqlSession.selectList("org.mybatis.board.getInquiryList", userId);
            response.put("result", "success");
            response.put("data", inquiries);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "문의 목록 조회 중 오류가 발생했습니다.");
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
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> params = new HashMap<>();
            params.put("inquiryId", inquiryId);
            params.put("userId", userId);

            Map<String, Object> inquiry = sqlSession.selectOne("org.mybatis.board.getInquiryDetail", params);
            if (inquiry == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 문의입니다.");
                return ResponseEntity.notFound().build();
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

    // 이미지 업로드 메소드
    private String uploadImage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        LocalDate now = LocalDate.now();
        String datePath = String.format("%d/%02d/%02d", now.getYear(), now.getMonthValue(), now.getDayOfMonth());
        String uploadDir = "/uploads/inquiry/" + datePath;
        
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        String filePath = uploadDir + "/" + fileName;
        File dest = new File(filePath);
        //image.transferTo(dest);
        
        return "/inquiry/" + datePath + "/" + fileName;
    }
}