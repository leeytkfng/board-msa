package com.example.userservice.auth;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig{

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) //csrf 보호 비활성화 , jwt 사용시 필요없음
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세선 사용 x ,토큰 기반
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/oauth/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH , "/api/user/**").permitAll()
                        .requestMatchers("/ws/**","/sockjs-node/**","/api/blog/**","/api/register","/api/login","/api/check-login","/api/logout","/api/user/{email}","/api/posts" ,"api/blogs/**","/api/**","/comments/**").permitAll()
                        //위와같은 주소창에서 접근을 허용한다. 만일안s할경우 요청자체가 거부.
                        .requestMatchers("/api/my-blogs").authenticated() //인증된 사용자만 거부.
                        .requestMatchers(HttpMethod.DELETE,"api/user/**").authenticated()
                        .anyRequest().authenticated() //나머지 요청은 인증된 사용자만 접근이가능하게.
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);//jwt 필터추가 , 추후 공부!
//                .anonymous(AbstractHttpConfigurer::disable); //익명 사용자 필터 자동적용 헤제
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager(); //수정 ?
    }


}
