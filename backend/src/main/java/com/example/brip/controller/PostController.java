package com.example.brip.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@Controller
@RestController
@RequestMapping(value = "/api/post", produces = "application/json;charset=UTF-8")
@Tag(name = "Post API", description = "게시물 관련 API")
public class PostController {
    
    @Autowired
    SqlSession sqlSession;

    // 게시물 작성
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> createPost(
            @RequestBody(required = true) Map<String, Object> postData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
    
            // 로깅 추가
            System.out.println("Received postData: " + postData);
    
            // 입력값 직접 확인
            String title = String.valueOf(postData.get("title"));
            String content = String.valueOf(postData.get("content"));
            String category = String.valueOf(postData.get("category"));
    
            // 데이터 새로 구성
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("title", title);
            params.put("content", content);
            params.put("category", category);
    
            // MyBatis insert 실행
            sqlSession.insert("org.mybatis.post.insertPost", params);
            
            response.put("result", "success");
            response.put("message", "게시물이 등록되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace(); // 에러 상세 로깅
            response.put("result", "fail");
            response.put("message", "게시물 등록 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    // 게시물 수정
    @PostMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> updatePost(@RequestBody Map<String, Object> postData, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 필수 필드 검증
            if (postData.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            if (postData.get("title") == null || postData.get("title").toString().trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "제목을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (postData.get("content") == null || postData.get("content").toString().trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 카테고리 검증
            String category = (String) postData.get("category");
            if (category == null || category.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "카테고리를 선택해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 카테고리 유효성 검사
            Set<String> validCategories = new HashSet<>(Arrays.asList(
                "노하우&Q&A", "실시간채팅", "업종별/연차별", "정보공유"
            ));
            if (!validCategories.contains(category)) {
                response.put("result", "fail");
                response.put("message", "유효하지 않은 카테고리입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 게시물 작성자 확인
            Map<String, Object> existingPost = sqlSession.selectOne("org.mybatis.post.getPostById", postData);
            if (existingPost == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }
            System.out.println("existingPost: " + existingPost); // 전체 맵 내용 확인
            System.out.println("DB userId: " + existingPost.get("user_id")); // DB에서 가져온 user_id
            System.out.println("Current userId: " + userId);
            String dbUserId = ""+existingPost.get("user_id");
            if (!dbUserId.equals(userId)) {
                response.put("result", "fail");
                response.put("message", "게시물 수정 권한이 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 게시물 수정
            postData.put("userId", userId);
            sqlSession.update("org.mybatis.post.updatePost", postData);
            
            response.put("result", "success");
            response.put("message", "게시물이 수정되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "게시물 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시물 삭제
    @PostMapping("/delete")
    public ResponseEntity<Map<String, String>> deletePost(@RequestBody Map<String, Object> postData, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 게시물 ID 검증
            if (postData.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 게시물 작성자 확인
            Map<String, Object> existingPost = sqlSession.selectOne("org.mybatis.post.getPostById", postData.get("postId"));
            if (existingPost == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            String dbUserId = ""+existingPost.get("user_id");
            if (!dbUserId.equals(userId)) {
                response.put("result", "fail");
                response.put("message", "게시물 삭제 권한이 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 게시물 삭제
            sqlSession.delete("org.mybatis.post.softDeletePost", postData);
            
            response.put("result", "success");
            response.put("message", "게시물이 삭제되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "게시물 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

// 게시물 목록 조회
@PostMapping("/list")
public ResponseEntity<Map<String, Object>> getPostList(@RequestBody Map<String, Object> params) {
    Map<String, Object> response = new HashMap<>();
    try {
        int page = (int) params.getOrDefault("page", 0);
        int size = (int) params.getOrDefault("size", 10);
        int offset = page * size;
        
        params.put("offset", offset);
        params.put("size", size);
        
        List<Map<String, Object>> posts = sqlSession.selectList("org.mybatis.post.getPosts", params);
        Integer totalCount = sqlSession.selectOne("org.mybatis.post.getPostsCount", params);
        
        response.put("result", "success");
        response.put("data", posts);
        response.put("totalCount", totalCount);
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        response.put("result", "fail");
        response.put("message", "게시물 목록 조회 중 오류가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

    // 게시물 상세 조회
    @PostMapping("/detail")
    public ResponseEntity<Map<String, Object>> getPostDetail(@RequestBody Map<String, Object> params) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (params.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> post = sqlSession.selectOne("org.mybatis.post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 조회수 증가
            sqlSession.update("org.mybatis.post.increaseViewCount", params);
            
            response.put("result", "success");
            response.put("data", post);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "게시물 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시물 좋아요
    @PostMapping("/like")
    public ResponseEntity<Map<String, String>> likePost(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 필수 파라미터 검증
            if (params.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 게시물 존재 확인
            Map<String, Object> post = sqlSession.selectOne("org.mybatis.post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 이미 좋아요 했는지 확인
            Map<String, Object> likeParams = new HashMap<>();
            likeParams.put("userId", userId);
            likeParams.put("postId", params.get("postId"));
            
            Integer likeExists = sqlSession.selectOne("org.mybatis.post.checkLikeExists", likeParams);
            
            if (likeExists > 0) {
                // 좋아요 취소
                sqlSession.delete("org.mybatis.post.deleteLike", likeParams);
                response.put("result", "success");
                response.put("message", "좋아요가 취소되었습니다.");
            } else {
                // 좋아요 추가
                sqlSession.insert("org.mybatis.post.insertLike", likeParams);
                response.put("result", "success");
                response.put("message", "좋아요가 추가되었습니다.");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "좋아요 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시물 신고
    @PostMapping("/report")
    public ResponseEntity<Map<String, String>> reportPost(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 필수 파라미터 검증
            if (params.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            if (params.get("reason") == null || params.get("reason").toString().trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "신고 사유를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 게시물 존재 확인
            Map<String, Object> post = sqlSession.selectOne("org.mybatis.post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }
            String dbUserId = ""+post.get("userId");
            // 자신의 게시물은 신고할 수 없음
            if (dbUserId.equals(userId)) {
                response.put("result", "fail");
                response.put("message", "자신의 게시물은 신고할 수 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 이미 신고했는지 확인
            Map<String, Object> reportParams = new HashMap<>();
            reportParams.put("userId", userId);
            reportParams.put("postId", params.get("postId"));
            
            Integer reportExists = sqlSession.selectOne("org.mybatis.post.checkReportExists", reportParams);
            
            if (reportExists > 0) {
                response.put("result", "fail");
                response.put("message", "이미 신고한 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 신고 데이터 준비
            reportParams.put("reason", params.get("reason"));
            reportParams.put("status", "PENDING"); // 신고 상태 (PENDING, RESOLVED, REJECTED)
            
            // 신고 추가
            sqlSession.insert("org.mybatis.post.insertReport", reportParams);
            
            response.put("result", "success");
            response.put("message", "게시물이 신고되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "신고 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시물 신고 취소
    @PostMapping("/cancel-report")
    public ResponseEntity<Map<String, String>> cancelReport(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 필수 파라미터 검증
            if (params.get("postId") == null) {
                response.put("result", "fail");
                response.put("message", "게시물 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 신고 데이터 존재 확인
            Map<String, Object> reportParams = new HashMap<>();
            reportParams.put("userId", userId);
            reportParams.put("postId", params.get("postId"));
            
            Integer reportExists = sqlSession.selectOne("org.mybatis.post.checkReportExists", reportParams);
            
            if (reportExists == 0) {
                response.put("result", "fail");
                response.put("message", "신고 내역이 존재하지 않습니다.");
                return ResponseEntity.ok(response);
            }

            // 신고 취소
            sqlSession.delete("org.mybatis.post.deleteReport", reportParams);
            
            response.put("result", "success");
            response.put("message", "신고가 취소되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "신고 취소 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}