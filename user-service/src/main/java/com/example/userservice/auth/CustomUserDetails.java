package com.example.userservice.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// 사용자의 인증정보를 저장하는 부분 / UserDetails Security에서 사용하는 객체 , 로그인 및 인증 관리
public class CustomUserDetails implements UserDetails {
    private final String email; //security 부분에서는 username 역할을함.
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities; //사용자 권한 설정역할(ROLE_USER)

    public CustomUserDetails(String email, String password , String role) {
        this.email = email;
        this.password = password;
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; // 사용자 권환 반환
    }
    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return email; //시큐리티 부분에서는 username을 email로 사용;
    }
    @Override
    public  boolean isAccountNonExpired() {
        return true; //계정 만료 체크여부
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;       //계정 잠금 여부 확익
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true; //비밀번호 만료 체크
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}
