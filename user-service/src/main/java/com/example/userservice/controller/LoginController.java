package com.example.userservice.controller;

import com.example.userservice.auth.JwtTokenService;
import com.example.userservice.dto.LoginRequestDto;
import com.example.userservice.dto.LoginResponseDto;
import com.example.userservice.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class LoginController {

    private final LoginService loginService;

    private final JwtTokenService jwtTokenService;

    @Autowired
    public LoginController(LoginService loginService , JwtTokenService jwtTokenService) {
        this.loginService = loginService;
        this.jwtTokenService =jwtTokenService;
    }

    // 로그인 요청 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        System.out.println("Post /api/login 호출");
        System.out.println("요청 데이터: " + loginRequestDto);

        LoginResponseDto response = loginService.login(loginRequestDto);
        System.out.println("삭제 검증:" +response.getDeletedAt());

        if(response.getDeletedAt() != null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String accessToken = jwtTokenService.createAccessToken(loginRequestDto.getEmail());
        String refreshToken = jwtTokenService.createRefreshToken(loginRequestDto.getEmail());

        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // 로그인 실패 시 메시지 반환
        } else {
            // 로그인 성공 시 JWT 토큰을 헤더에 포함시켜 반환
            ResponseCookie accessCookie = ResponseCookie.from("accessToken",accessToken)
                    .httpOnly(true) //js에서 접근 불가능
                    .secure(false) //Https에서만 전송 , 지금은 로컬이라 false
                    .path("/") //전체 도메인에서 접근
                    .maxAge(60*60) // 쿠키 유효시간 설정
                    .sameSite("Lax") // Cors문제 방지
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken",refreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(60*60*24*7)
                    .sameSite("Lax")
                    .build();


            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE,accessCookie.toString()) //쿠키에 응답 추가
                    .header(HttpHeaders.SET_COOKIE,refreshCookie.toString())
                    .body(response);
        }
    }
}
