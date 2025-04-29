package com.example.userservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KakaoUserInfoDto {

    public Long getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(Long kakaoId) {
        this.kakaoId = kakaoId;
    }

    public KakaoAccount getKakaoAccount() {
        return kakaoAccount;
    }

    public void setKakaoAccount(KakaoAccount kakaoAccount) {
        this.kakaoAccount = kakaoAccount;
    }

    @JsonProperty("id")
    private Long kakaoId; //카카오 고유 ID

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    public static class KakaoAccount {
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public KakaoProfile getProfile() {
            return profile;
        }

        public void setProfile(KakaoProfile profile) {
            this.profile = profile;
        }

        private String email;

        @JsonProperty("profile")
        private KakaoProfile profile;
    }

    public static class KakaoProfile {
        public String getNickname() {
            return nickname;
        }

        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public String getProfileImage() {
            return profileImage;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }

        @JsonProperty("nickname")
        private String nickname;

        @JsonProperty("profile_image_url")
        private String profileImage;
    }
}
