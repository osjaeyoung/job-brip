package com.example.brip.config;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import com.example.brip.config.JwtTokenProvider;  // JwtTokenProvider 클래스의 실제 위치에 맞게 수정하세요

@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // OPTIONS 요청은 통과
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // Authorization 헤더에서 JWT 토큰 추출
        String token = request.getHeader("Authorization");
        
        // 토큰이 없는 경우
        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"인증이 필요합니다.\"}");
            return false;
        }
        // Bearer 제거
        token = token.substring(7);

        try {
            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                String role = jwtTokenProvider.getRoleFromToken(token);
                
                // URL이 /api/admin으로 시작하는 경우
                if (request.getRequestURI().startsWith("/api/admin")) {
                    if (!"ADMIN".equals(role)) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"message\": \"관리자 권한이 필요합니다.\"}");
                        return false;
                    }
                }

                request.setAttribute("userId", userId);
                request.setAttribute("role", role);
                return true;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"유효하지 않은 토큰입니다.\"}");
            return false;
        }

        return false;
    }
}