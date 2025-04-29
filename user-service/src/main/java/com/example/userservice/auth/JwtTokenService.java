package com.example.userservice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secretKey; //서명에 사용할키

    @Value("${jwt.expiration}")
    private long expirationTime;
    //AccessToken 생성관련
    public String createAccessToken(String email){
        return Jwts.builder()
                .setSubject(email) //토큰 주제 ,사용자정보
                .setIssuedAt(new Date(System.currentTimeMillis())) //발행시간
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) //만료시간
                .signWith(SignatureAlgorithm.HS256 ,secretKey)//서명 알고리즘과 시크릿키
                .compact(); //토큰생성
    }
    //리프레쉬 토큰 생성관련
    public String createRefreshToken(String email){
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+4000000))
                .signWith(SignatureAlgorithm.HS256,secretKey)
                .compact();
    }
    //토큰을 통해 이메일 추출
    public String getEmailFromToken(String token){
        return Jwts.parserBuilder() //jwt토큰 해석부분
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); //사용자 이메일 추출
    }

    //토큰 만료 관련로직
    public boolean isTokenExpired(String token) {
        try {
            Date expiation = Jwts.parserBuilder() //만료기간
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)  //수정 -> parser -> parserBuilder
                    .getBody()
                    .getExpiration();
            return expiation.before(new Date());
        } catch (Exception e ){
            return true;
        }
    }

    public long getExpirationTimeFromToken(String token){
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().getTime() / 1000; //초단위 변환
        } catch (Exception e){
            return 0;
        }
    }
}
