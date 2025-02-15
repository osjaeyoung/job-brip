package com.example.brip.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.brip.config.JwtTokenProvider;
import com.example.brip.service.EmailService;
import com.example.brip.util.FileUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
@Controller
@RestController
@RequestMapping(value = "/api/user", produces = "application/json;charset=UTF-8")
@Tag(name = "User API", description = "사용자 관련 API")
public class UserController {
    @Autowired
    SqlSession sqlSession;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private HttpSession httpSession;

   @Autowired
   private EmailService emailService;

   @PostMapping("/sample")
    public void sample(HttpServletRequest request) {
      String userId = (String) request.getAttribute("userId");
      System.out.println("sample Test userId:"+userId);
    }

    //회원가입: 닉네임 중복체크
    @PostMapping("/check-nickname")    
    public ResponseEntity<Map<String, String>> checkNickname(@RequestBody Map<String, String> payload) {
       Map<String, String> response = new HashMap<>();
       try {
           String nickname = payload.get("nickname");
           
           // 닉네임 유효성 검사 
           if (nickname == null || nickname.length() < 2 || nickname.length() > 12 
               || !nickname.matches("^[a-zA-Z0-9가-힣]*$")) {
               response.put("result", "fail");
               response.put("message", "닉네임은 2~12자의 한글, 영문, 숫자만 가능합니다.");
               return ResponseEntity.ok(response);
           }
           
           Integer count = sqlSession.selectOne("org.mybatis.user.countByNickname", nickname);
           if (count == 0) {
               response.put("result", "success");
               response.put("message", "사용 가능한 닉네임입니다.");
           } else {
               response.put("result", "fail"); 
               response.put("message", "이미 존재하는 닉네임입니다.");
           }
           return ResponseEntity.ok(response);
           
       } catch (Exception e) {
           response.put("result", "fail");
           response.put("message", "닉네임 확인 중 오류가 발생했습니다.");
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
       }
    }

    //회원가입
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, Object> userData) {
      Map<String, String> response = new HashMap<>();  
      
      // 필수 필드 유효성 검사
      String[] requiredFields = {"name", "nickname", "email", "password"};
      for (String field : requiredFields) {
          if (userData.get(field) == null || userData.get(field).toString().trim().isEmpty()) {
              response.put("result", "fail");
              response.put("message", field + "은(는) 필수 입력값입니다.");
              return ResponseEntity.badRequest().body(response);
          }
      }

      try {
        // 이메일 중복 체크
        Integer emailCount = sqlSession.selectOne("org.mybatis.user.countByEmail", userData.get("email"));
        if (emailCount > 0) {
            response.put("result", "fail");
            response.put("message", "이미 등록된 이메일입니다.");
            return ResponseEntity.ok(response);
        }

        // 비밀번호 암호화 - 디버깅
        String rawPassword = userData.get("password").toString();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(rawPassword);
        //System.out.println("Raw password: " + rawPassword);
        //System.out.println("Encoded password: " + encodedPassword);
        // UUID 생성하여 추가
        String cuid = UUID.randomUUID().toString();
        userData.put("cuid", cuid);
        userData.put("password", encodedPassword);
        sqlSession.insert("org.mybatis.user.insertUser", userData);
        response.put("result", "success");
        response.put("message", "회원가입이 완료되었습니다.");
        return ResponseEntity.ok(response);
        
      } catch (Exception e) {
        response.put("result", "fail");
        response.put("message", "회원가입 처리 중 오류가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
      }
    }    

    //이메일과 닉네임 정보 제거됨(중복체크 로그인 방지)
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, String>> withdrawUser(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
    
            // 회원 탈퇴 처리
            sqlSession.update("org.mybatis.user.withdrawUser", userId);
    
            response.put("result", "success");
            response.put("message", "회원 탈퇴가 완료되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "회원 탈퇴 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, Object> loginData, HttpServletRequest request) {
      Map<String, String> response = new HashMap<>();
      
      try {
          String email = (String) loginData.get("email");
          String password = (String) loginData.get("password");

          // 입력값 검증
          if (email == null || email.trim().isEmpty()) {
              response.put("result", "fail");
              response.put("message", "이메일을 입력해주세요.");
              return ResponseEntity.badRequest().body(response);
          }

          if (password == null || password.trim().isEmpty()) {
              response.put("result", "fail");
              response.put("message", "비밀번호를 입력해주세요.");
              return ResponseEntity.badRequest().body(response);
          }

          // 이메일 형식 검증
          if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
              response.put("result", "fail");
              response.put("message", "올바른 이메일 형식이 아닙니다.");
              return ResponseEntity.badRequest().body(response);
          }

          // 이메일로 사용자 조회
          Map<String, Object> user = sqlSession.selectOne("org.mybatis.user.getUserByEmail", email);
          
          if (user == null) {
              response.put("result", "fail");
              response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
              return ResponseEntity.ok(response);
          }

          // 비밀번호 검증
          BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
          if (!encoder.matches(password, (String) user.get("password"))) {
              response.put("result", "fail");
              response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
              return ResponseEntity.ok(response);
          }

          // 세션에 사용자 정보 저장
          //httpSession.setAttribute("userId", user.get("id"));
          //httpSession.setAttribute("email", user.get("email"));
          // Generate JWT token
          String token = jwtTokenProvider.generateToken(
            user.get("id").toString()
          );
          System.out.println("token:"+token);

          response.put("result", "success");
          response.put("message", "로그인 성공");
          //response.put("userId", user.get("id").toString());
          response.put("email", user.get("email").toString());
          response.put("token", token);
          response.put("nickname", user.get("nickname").toString());
          response.put("cuid", user.get("cuid").toString());
          return ResponseEntity.ok(response);
          
      } catch (Exception e) {
          response.put("result", "fail");
          response.put("message", "로그인 처리 중 오류가 발생했습니다.");
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
      }
    }  

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "이미 로그아웃된 상태입니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // JWT는 클라이언트 측에서 제거되므로, 서버에서는 성공 응답만 보냄
            response.put("result", "success");
            response.put("message", "로그아웃되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    //비번찾기 : 인증코드 발송
    @PostMapping("/send-verification")
    public ResponseEntity<Map<String, String>> sendVerification(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            
            // 입력값 검증
            if (email == null || email.trim().isEmpty()) {
              response.put("result", "fail");
              response.put("message", "이메일을 입력해주세요.");
              return ResponseEntity.badRequest().body(response);
            }

            // 이메일 형식 검증
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response.put("result", "fail");
                response.put("message", "올바른 이메일 형식이 아닙니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이메일 존재 여부 확인
            // Integer userExists = sqlSession.selectOne("org.mybatis.user.countByEmail", email);
            // if (userExists == 0) {
            //     response.put("result", "fail");
            //     response.put("message", "등록되지 않은 이메일입니다.");
            //     return ResponseEntity.ok(response);
            // }

            emailService.sendVerificationEmail(email);
            
            response.put("result", "success");
            response.put("message", "인증코드가 발송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "인증코드 발송 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    // 비번찾기 : 인증코드 인증
    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            String code = request.get("code");
            // 이메일 유효성 검사
            if (email == null || email.trim().isEmpty()) {
              response.put("result", "fail");
              response.put("message", "이메일을 입력해주세요.");
              return ResponseEntity.badRequest().body(response);
            }
            // 이메일 형식 검사
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response.put("result", "fail");
                response.put("message", "올바른 이메일 형식이 아닙니다.");
                return ResponseEntity.badRequest().body(response);
            }
            // 인증코드 유효성 검사
            if (code == null || code.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "인증코드를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (emailService.verifyCode(email, code)) {
                response.put("result", "success");
                response.put("message", "인증이 완료되었습니다.");
            } else {
                response.put("result", "fail");
                response.put("message", "잘못된 인증코드입니다.");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "인증 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    } 
    
    //보안코드 필요해보임
    //비밀번호 변경기능
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            // 필수 입력값 검증
            String email = request.get("email");
            String newPassword = request.get("password");

            // null 체크 및 빈 문자열 체크
            if (email == null || email.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("result", "fail");
                response.put("message", "새로운 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이메일 형식 검증 (선택적)
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response.put("result", "fail");
                response.put("message", "올바른 이메일 형식이 아닙니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 비밀번호 유효성 검사 (예: 최소 8자, 영문/숫자/특수문자 포함)
            if (!newPassword.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")) {
                response.put("result", "fail");
                response.put("message", "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이메일 존재 여부 확인
            Integer userExists = sqlSession.selectOne("org.mybatis.user.countByEmail", email);
            if (userExists == 0) {
                response.put("result", "fail");
                response.put("message", "존재하지 않는 이메일입니다.");
                return ResponseEntity.ok(response);
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String encodedPassword = encoder.encode(newPassword);

            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("password", encodedPassword);

            sqlSession.update("org.mybatis.user.updatePassword", params);
            response.put("result", "success");
            response.put("message", "비밀번호가 변경되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    } 


    //--------------------------------------------------------
    // 프로필 조회
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> userProfile = sqlSession.selectOne("org.mybatis.user.getUserProfile", userId);
            if (userProfile == null) {
                response.put("result", "fail");
                response.put("message", "프로필 정보를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("result", "success");
            response.put("data", userProfile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "프로필 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    // 프로필 이미지 업데이트
    @PostMapping(value = "/profile/image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> updateProfileImage(
        @RequestParam("image") MultipartFile image,
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
            if (image.getSize() > 5 * 1024 * 1024) {
                response.put("result", "fail");
                response.put("message", "이미지 크기는 5MB를 초과할 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이미지 저장 및 URL 생성
            String imageUrl = FileUtil.uploadProfileImage(image);
            
            // DB 업데이트
            Map<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("profileImage", imageUrl);
            
            sqlSession.update("org.mybatis.user.updateProfileImage", params);

            response.put("result", "success");
            response.put("message", "프로필 이미지가 업데이트되었습니다.");
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "프로필 이미지 업데이트 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 프로필 정보 업데이트
    @PostMapping("/profile/update")
    public ResponseEntity<Map<String, String>> updateProfile(
            @RequestBody Map<String, Object> profileData,
            HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String userId = (String) request.getAttribute("userId");
            if (userId == null) {
                response.put("result", "fail");
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 필수 필드 검증
            String[] requiredFields = {"name", "nickname", "phone", "birthDate"};
            for (String field : requiredFields) {
                if (profileData.get(field) == null || profileData.get(field).toString().trim().isEmpty()) {
                    response.put("result", "fail");
                    response.put("message", field + "은(는) 필수 입력값입니다.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            profileData.put("userId", userId);
            sqlSession.update("org.mybatis.user.updateUserProfile", profileData);

            response.put("result", "success");
            response.put("message", "프로필이 업데이트되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("result", "fail");
            response.put("message", "프로필 업데이트 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }    
}
