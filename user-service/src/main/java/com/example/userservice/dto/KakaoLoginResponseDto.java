package com.example.userservice.dto;

public class KakaoLoginResponseDto {
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public boolean isNewUser() {
        return isNewUser;
    }

    public void setNewUser(boolean newUser) {
        isNewUser = newUser;
    }

    private String accessToken;
    private String refreshToken;
    private String message;
    private String email;
    private String profileImage;
    private boolean isNewUser;

    public KakaoLoginResponseDto(String accessToken, String refreshToken,String message,String email,String profileImage,boolean isNewUser){
        this.accessToken =accessToken;
        this.refreshToken =refreshToken;
        this.message =message;
        this.email =email;
        this.profileImage =profileImage;
        this.isNewUser = isNewUser;
    }
}
