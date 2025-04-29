package com.example.userservice.service;

import com.example.userservice.auth.JwtTokenService;
import com.example.userservice.dto.LoginRequestDto;
import com.example.userservice.dto.LoginResponseDto;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager, JwtTokenService jwtTokenProvider , StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
    }

    @Transactional(readOnly = true) //트랜잭션 적용 (앍기전용) , 논리삭제된 유저가 로그인되지않도록 수정.
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        String email = loginRequestDto.getEmail(); //loginRequstDto에서 받아오기

        if (email == null) { //없으면 에러 던져서 이메일 요청
            throw new IllegalArgumentException("email is required");
        }
        email = email.trim(); //이메일 앞뒤 공백 자르기

        // 유저 조회
        User user = userRepository.findByEmailIncludingDeleted(email)
                .orElseThrow(() -> new RuntimeException("로그인실패: 이메일 없음"));

        if (user.getDeletedAt() != null) {
            System.out.println("탈퇴한 계정:" + user.getEmail());
            return new LoginResponseDto(null,null,"탈퇴한 회원",null,0,user.getDeletedAt());
        }

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("로그인 실패: 비밀번호 불일치");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), loginRequestDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtTokenProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

        long exp = jwtTokenProvider.getExpirationTimeFromToken(accessToken);

        redisTemplate.opsForValue().set("LOGIN:" + user.getEmail() ,String.valueOf(user.getId()), Duration.ofMinutes(30));

        return new LoginResponseDto(accessToken, refreshToken, "로그인 성공", user.getEmail(), exp, null);

    }
}
