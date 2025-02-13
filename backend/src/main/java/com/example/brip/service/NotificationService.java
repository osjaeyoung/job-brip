package com.example.brip.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
// NotificationService.java
@Service
public class NotificationService {
    @Autowired
    private SqlSession sqlSession;
    
    // 댓글 알림 생성 (postId와 댓글 내용만 받도록 수정)
    public void createCommentNotification(int postId, String userId, String commentContent) {
        try {
            // 게시글 정보 조회
            Map<String, Object> post = sqlSession.selectOne(
                "org.mybatis.post.getPostById", 
                postId
            );
            
            // 자신의 게시글에 댓글을 달면 알림을 보내지 않음
            if (post != null && !post.get("user_id").toString().equals(userId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("userId", post.get("user_id"));
                params.put("title", "새로운 댓글이 달렸습니다");
                params.put("content", String.format("게시글 '%s'에 새 댓글이 달렸습니다: %s", 
                    post.get("content").toString(), 
                    commentContent));
                    
                sqlSession.insert("org.mybatis.notification.insertNotification", params);
            }
        } catch (Exception e) {
            // 알림 생성 실패 시 로그만 남기고 예외는 던지지 않음
            // 알림 실패가 핵심 비즈니스 로직을 중단시키지 않도록
            e.printStackTrace();
        }
    }



    //---------------------------아래는 작업은 안함
    // 대댓글 알림 생성
    public void createReplyNotification(int postId, String userId, int parentCommentId, String replyContent) {
        try {
            // 게시글 정보 조회
            Map<String, Object> post = sqlSession.selectOne(
                "org.mybatis.post.getPostById", 
                postId
            );
            
            // 원댓글 작성자 정보 조회
            Map<String, Object> parentComment = sqlSession.selectOne(
                "org.mybatis.comment.getCommentById",
                parentCommentId
            );

            // 게시글 작성자에게 알림
            if (post != null && !post.get("user_id").toString().equals(userId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("userId", post.get("user_id"));
                params.put("title", "게시글에 새로운 답글이 달렸습니다");
                params.put("content", String.format("게시글 '%s'에 새 답글이 달렸습니다: %s", 
                    post.get("title").toString(), 
                    replyContent));
                    
                sqlSession.insert("org.mybatis.notification.insertNotification", params);
            }

            // 원댓글 작성자에게 알림
            if (parentComment != null && !parentComment.get("user_id").toString().equals(userId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("userId", parentComment.get("user_id"));
                params.put("title", "댓글에 답글이 달렸습니다");
                params.put("content", String.format("게시글 '%s'의 댓글에 답글이 달렸습니다: %s", 
                    post.get("title").toString(), 
                    replyContent));
                    
                sqlSession.insert("org.mybatis.notification.insertNotification", params);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 이력서 상태 변경 알림
    public void createResumeStatusNotification(int userId, String resumeTitle, String status) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("title", "이력서 상태가 변경되었습니다");
        params.put("content", String.format("이력서 '%s'의 상태가 '%s'로 변경되었습니다", 
            resumeTitle, status));
            
        sqlSession.insert("org.mybatis.notification.insertNotification", params);
    }
    
    // 새 공지사항 알림
    public void createNoticeNotification(List<Integer> userIds, String noticeTitle) {
        for (Integer userId : userIds) {
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("title", "새로운 공지사항");
            params.put("content", String.format("새로운 공지사항이 등록되었습니다: %s", noticeTitle));
                
            sqlSession.insert("org.mybatis.notification.insertNotification", params);
        }
    }

}