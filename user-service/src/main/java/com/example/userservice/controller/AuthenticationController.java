package com.example.userservice.controller;

import com.example.userservice.auth.JwtTokenService;
import com.example.userservice.dto.LoginResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class AuthenticationController {
    private final JwtTokenService jwtTokenService;
    private final StringRedisTemplate redisTemplate;

    @Autowired
    public AuthenticationController(JwtTokenService jwtTokenService, StringRedisTemplate redisTemplate){
        this.jwtTokenService = jwtTokenService;//생성자 주입
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/check-login")
    public ResponseEntity<?> checkLogin(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if(cookies == null){
            System.out.println("쿠키없다 다시해!");
        } else {
            for(Cookie cookie : cookies){
                System.out.print(1); //쿠키 확인부분 추후 수정할거면 하셈
            }
        }



        String accessToken = getCookieValue(request, "accessToken");
        String refreshToken = getCookieValue(request, "refreshToken");

        if (accessToken != null) {
            if (!jwtTokenService.isTokenExpired(accessToken)) {
                String email = jwtTokenService.getEmailFromToken(accessToken);

                String userId = redisTemplate.opsForValue().get("LOGIN:" + email);

                long exp = jwtTokenService.getExpirationTimeFromToken(accessToken);
                return ResponseEntity.ok(new LoginResponseDto(accessToken, refreshToken, "로그인유지됨",email,exp ,null));
            }
        }

        if (refreshToken != null) {
            if (!jwtTokenService.isTokenExpired(refreshToken)) {
                String email = jwtTokenService.getEmailFromToken(refreshToken);
                String newAccessToken = jwtTokenService.createAccessToken(email);
                long exp = jwtTokenService.getExpirationTimeFromToken(newAccessToken);

                return ResponseEntity.ok()
                        .header("Set-Cookie", "accessToken:" + newAccessToken + "; HttpOnly: Path=/; Max-Age=1800")
                        .body(new LoginResponseDto(accessToken,refreshToken,"토큰재발급",email,exp,null));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDto(null,null,"로그인필요",null ,0,null));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpServletRequest request){
        String accessToken = getCookieValue(request, "accessToken");

        if(accessToken != null && !jwtTokenService.isTokenExpired(accessToken)){
            String email = jwtTokenService.getEmailFromToken(accessToken);
            long exp = jwtTokenService.getExpirationTimeFromToken(accessToken);
            return  ResponseEntity.ok(new LoginResponseDto(accessToken,null,"로그인 유지", email,exp ,null));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseDto(null,null,"로그인 필요",null,0 ,null));
    }

    private String getCookieValue(HttpServletRequest request, String cookieName){
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}


