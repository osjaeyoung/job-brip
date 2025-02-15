package com.example.brip.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;

import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    // 관리자용 토큰 생성
    public String generateAdminToken(String adminId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        return Jwts.builder()
            .setSubject(adminId)
            .claim("role", "ADMIN")  // 역할 정보 추가
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String generateToken(String userId) {
      Date now = new Date();
      Date expiryDate = new Date(now.getTime() + jwtExpiration);
      
      return Jwts.builder()
              .setSubject(userId)
              .claim("role", "USER")   // 역할 정보 추가
              .setIssuedAt(now)
              .setExpiration(expiryDate)
              .signWith(SignatureAlgorithm.HS512, jwtSecret)
              .compact();
    }

    public String getUserIdFromToken(String token) {
        //임시코드
        if(token.compareTo("testtestTmp")==0)
            return "2";
        else if(token.compareTo("testTmpAdmin")==0)
            return "1";
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {

            //임시코드
            if(token.compareTo("testtestTmp")==0 || token.compareTo("testTmpAdmin")==0)
                return true;
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // 토큰에서 역할 정보 추출
    public String getRoleFromToken(String token) {
        if(token.compareTo("testtestTmp")==0)
            return "USER";
        else if(token.compareTo("testTmpAdmin")==0)
            return "ADMIN";
        
        return Jwts.parserBuilder()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role", String.class);
    }
}