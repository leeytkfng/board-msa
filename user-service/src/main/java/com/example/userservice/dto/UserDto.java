package com.example.userservice.dto;

import jakarta.validation.constraints.*;

public class UserDto {

    @NotEmpty(message = "Email is required")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(min = 1, message = "First name must be at least 1 character long")
    private String firstName;

    @NotEmpty(message = "Last name is required")
    @Size(min = 1, message = "Last name must be at least 1 character long")
    private String lastName;

    @NotNull(message = "Birthday is required")
    private Integer birthday; // int 대신 Integer 사용하여 유효성 검사 가능

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotEmpty(message = "Sex is required")
    @Pattern(regexp = "^(M|F)$", message = "Sex must be 'M' or 'F'")
    private String sex;

    @NotEmpty(message = "Phone number is required")
    @Pattern(regexp = "^\\+?\\d+$", message = "Phone number must be numeric")
    private String phoneNumber;

    // 기본 생성자
    public UserDto() {}

    // Getter & Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getBirthday() {
        return birthday;
    }

    public void setBirthday(Integer birthday) {
        this.birthday = birthday;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
