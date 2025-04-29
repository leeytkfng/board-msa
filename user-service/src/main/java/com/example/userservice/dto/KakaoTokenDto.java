package com.example.userservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KakaoTokenDto {

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public int getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(int expiresIn) {
        this.expiresIn = expiresIn;
    }

    public int getRefreshTokenExpiresIn() {
        return refreshTokenExpiresIn;
    }

    public void setRefreshTokenExpiresIn(int refreshTokenExpiresIn) {
        this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    }

    @JsonProperty("access_token") //Json키 - 값과 필드 매핑하기위한 어노테이션
    private String accessToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("expires_id")
    private int expiresIn;

    @JsonProperty("refresh_token_expires_in")
    private int refreshTokenExpiresIn;
}
