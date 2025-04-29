package com.example.userservice.controller;

import com.example.userservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthEmailController {

    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendAUthCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String code = String.valueOf((int)((Math.random() * 900000)+ 1000000)); // 6자리설정

        // Redis에 저장 (TTL: 5분)
        redisTemplate.opsForValue().set("emailAuth:" + email, code , Duration.ofMinutes(5));//5분

        //이메일 발송
        emailService.sendAuthCode(email,code);

        return ResponseEntity.ok("인증번호 발송완료");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String code = body.get("code");

        String key = "emailAuth:" + email; //공백 조심.
        String storedCode = redisTemplate.opsForValue().get(key);

        if(storedCode != null && storedCode.equals(code)){
            //인증성공시 redis 값을 삭제하라
            redisTemplate.delete(key);
            return ResponseEntity.ok("인증성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증실패");
        }
    }
}
