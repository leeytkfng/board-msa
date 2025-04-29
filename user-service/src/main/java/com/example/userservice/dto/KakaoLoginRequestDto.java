package com.example.userservice.dto;

public class KakaoLoginRequestDto {  //카카오에서 받은 인가코드 관련 Dto
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    private String code;
}
