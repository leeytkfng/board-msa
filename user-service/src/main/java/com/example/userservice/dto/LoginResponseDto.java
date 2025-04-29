package com.example.userservice.dto;

import java.time.LocalDateTime;

public class LoginResponseDto {
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    private String accessToken;

    private String refreshToken;

    private String message;

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    private LocalDateTime deletedAt;

    public long getExp() {
        return exp;
    }

    private long exp; // 만료시간 추가 17일

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String email;

    public LoginResponseDto(String accessToken, String refreshToken, String message, String email, long exp , LocalDateTime deletedAt){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.message = message;
        this.email = email;
        this.exp = exp;
        this.deletedAt = deletedAt;
    }


    public String getMessage() {
        return message;
    }
}
