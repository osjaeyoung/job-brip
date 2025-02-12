package com.example.brip.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPost(@RequestBody Map<String, Object> postData, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            
            // 필수 필드 검증
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

            // 게시물 데이터 준비
            postData.put("userId", userId);
            
            // 게시물 저장
            sqlSession.insert("post.insertPost", postData);
            
            response.put("result", "success");
            response.put("message", "게시물이 등록되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "게시물 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 게시물 수정
    @PostMapping("/update")
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

            // 게시물 작성자 확인
            Map<String, Object> existingPost = sqlSession.selectOne("post.getPostById", postData.get("postId"));
            if (existingPost == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            if (!existingPost.get("userId").toString().equals(userId)) {
                response.put("result", "fail");
                response.put("message", "게시물 수정 권한이 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 게시물 수정
            postData.put("userId", userId);
            sqlSession.update("post.updatePost", postData);
            
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
            Map<String, Object> existingPost = sqlSession.selectOne("post.getPostById", postData.get("postId"));
            if (existingPost == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            if (!existingPost.get("userId").toString().equals(userId)) {
                response.put("result", "fail");
                response.put("message", "게시물 삭제 권한이 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 게시물 삭제
            sqlSession.delete("post.deletePost", postData.get("postId"));
            
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
            List<Map<String, Object>> posts = sqlSession.selectList("post.getPostList", params);
            Integer totalCount = sqlSession.selectOne("post.getPostCount", params);
            
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

            Map<String, Object> post = sqlSession.selectOne("post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 조회수 증가
            sqlSession.update("post.increaseViewCount", params.get("postId"));
            
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
            Map<String, Object> post = sqlSession.selectOne("post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 이미 좋아요 했는지 확인
            Map<String, Object> likeParams = new HashMap<>();
            likeParams.put("userId", userId);
            likeParams.put("postId", params.get("postId"));
            
            Integer likeExists = sqlSession.selectOne("post.checkLikeExists", likeParams);
            
            if (likeExists > 0) {
                // 좋아요 취소
                sqlSession.delete("post.deleteLike", likeParams);
                response.put("result", "success");
                response.put("message", "좋아요가 취소되었습니다.");
            } else {
                // 좋아요 추가
                sqlSession.insert("post.insertLike", likeParams);
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
            Map<String, Object> post = sqlSession.selectOne("post.getPostById", params.get("postId"));
            if (post == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 자신의 게시물은 신고할 수 없음
            if (post.get("userId").toString().equals(userId)) {
                response.put("result", "fail");
                response.put("message", "자신의 게시물은 신고할 수 없습니다.");
                return ResponseEntity.ok(response);
            }

            // 이미 신고했는지 확인
            Map<String, Object> reportParams = new HashMap<>();
            reportParams.put("userId", userId);
            reportParams.put("postId", params.get("postId"));
            
            Integer reportExists = sqlSession.selectOne("post.checkReportExists", reportParams);
            
            if (reportExists > 0) {
                response.put("result", "fail");
                response.put("message", "이미 신고한 게시물입니다.");
                return ResponseEntity.ok(response);
            }

            // 신고 데이터 준비
            reportParams.put("reason", params.get("reason"));
            reportParams.put("status", "PENDING"); // 신고 상태 (PENDING, RESOLVED, REJECTED)
            
            // 신고 추가
            sqlSession.insert("post.insertReport", reportParams);
            
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
            
            Integer reportExists = sqlSession.selectOne("post.checkReportExists", reportParams);
            
            if (reportExists == 0) {
                response.put("result", "fail");
                response.put("message", "신고 내역이 존재하지 않습니다.");
                return ResponseEntity.ok(response);
            }

            // 신고 취소
            sqlSession.delete("post.deleteReport", reportParams);
            
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