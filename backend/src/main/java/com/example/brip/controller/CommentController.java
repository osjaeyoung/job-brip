package com.example.brip.controller;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping(value = "/api/comment", produces = "application/json;charset=UTF-8")
@Tag(name = "Comment API", description = "댓글 관련 API")
public class CommentController {
    
    @Autowired
    SqlSession sqlSession;

    // 댓글 목록 조회
    @GetMapping("/list/{postId}")
    public ResponseEntity<Map<String, Object>> getCommentList(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 메인 댓글 조회 (parent_id가 null인 댓글)
            Map<String, Object> params = new HashMap<>();
            params.put("postId", postId);
            params.put("parentId", null);
            
            List<Map<String, Object>> comments = sqlSession.selectList("org.mybatis.comment.getComments", params);
            
            response.put("result", "success");
            response.put("data", comments);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "댓글 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 대댓글 목록 조회
    @GetMapping("/replies/{commentId}")
    public ResponseEntity<Map<String, Object>> getReplies(@PathVariable Long commentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("parentId", commentId);
            
            List<Map<String, Object>> replies = sqlSession.selectList("org.mybatis.comment.getReplies", params);
            
            response.put("result", "success");
            response.put("data", replies);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "대댓글 목록 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 댓글 작성
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createComment(
            @RequestBody Map<String, Object> commentData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 필수 파라미터 검증
            if (commentData.get("postId") == null || commentData.get("content") == null) {
                response.put("result", "fail");
                response.put("message", "필수 항목이 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 댓글 데이터 구성
            commentData.put("userId", userId);
            
            // 댓글 저장
            sqlSession.insert("org.mybatis.comment.insertComment", commentData);
            
            // 게시글의 댓글 수 증가
            sqlSession.update("org.mybatis.post.incrementCommentCount", commentData);
            
            response.put("result", "success");
            response.put("message", "댓글이 등록되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "댓글 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 대댓글 작성
    @PostMapping("/reply")
    public ResponseEntity<Map<String, String>> createReply(
            @RequestBody Map<String, Object> replyData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 필수 파라미터 검증
            if (replyData.get("postId") == null || 
                replyData.get("parentId") == null || 
                replyData.get("content") == null) {
                response.put("result", "fail");
                response.put("message", "필수 항목이 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 부모 댓글 존재 확인
            Map<String, Object> params = new HashMap<>();
            params.put("commentId", replyData.get("parentId"));
            Map<String, Object> parentComment = sqlSession.selectOne(
                "org.mybatis.comment.getCommentById", 
                params  // Map 형태로 전달
            );
            
            if (parentComment == null) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 댓글입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 대댓글 데이터 구성
            replyData.put("userId", userId);
            
            // 대댓글 저장
            sqlSession.insert("org.mybatis.comment.insertReply", replyData);
            
            // 게시글의 댓글 수 증가
            sqlSession.update("org.mybatis.post.incrementCommentCount", replyData);
            
            response.put("result", "success");
            response.put("message", "답글이 등록되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "답글 등록 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 댓글 좋아요
    @PostMapping("/like")
    public ResponseEntity<Map<String, String>> likeComment(
            @RequestBody Map<String, Object> likeData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 필수 파라미터 검증
            if (likeData.get("commentId") == null) {
                response.put("result", "fail");
                response.put("message", "댓글 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 좋아요 데이터 구성
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("commentId", likeData.get("commentId"));

            // 이미 좋아요 했는지 확인
            Map<String, Object> existingLike = sqlSession.selectOne(
                "org.mybatis.comment.getCommentLike", 
                params
            );

            if (existingLike != null) {
                // 좋아요 취소
                sqlSession.delete("org.mybatis.comment.deleteCommentLike", params);
                sqlSession.update("org.mybatis.comment.decrementLikeCount", params);
                response.put("message", "좋아요가 취소되었습니다.");
            } else {
                // 좋아요 추가
                sqlSession.insert("org.mybatis.comment.insertCommentLike", params);
                sqlSession.update("org.mybatis.comment.incrementLikeCount", params);
                response.put("message", "좋아요가 추가되었습니다.");
            }
            
            response.put("result", "success");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "좋아요 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}