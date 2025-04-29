package com.example.userservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class LoginRequestDto {

    @NotEmpty(message = "email is required")
    @JsonProperty("email")
    private String email;

    @NotEmpty(message = "Password is required")
    @JsonProperty("password")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    // Getters and Setters
    public String getEmail(){
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString(){
        return "LoginRequestDto{" + "email='" + email + '\'' + ", password='" + password +'\'' + '}';
    }
}
