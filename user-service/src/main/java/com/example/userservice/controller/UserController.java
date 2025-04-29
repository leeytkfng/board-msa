package com.example.userservice.controller;

import com.example.userservice.dto.UserDto;
import com.example.userservice.dto.UserUpdateRequest;
import com.example.userservice.entity.User;
import com.example.userservice.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register") //@RequestBody 자바 객체로 conversion (HttpMessageConverter)
    public ResponseEntity<?> register(@Valid @RequestBody UserDto userDto , BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getAllErrors());
        }

        String result = userService.register(userDto); //binding 리절트는 처리 x
        if (result.equals("회원가입 성공")){
            return ResponseEntity.status(201).body(result);
        } else {
            return ResponseEntity.status(400).body(result);
        }
    }

    @PatchMapping("/user/{email}")
    public ResponseEntity<User> updateUser(
            @PathVariable String email,
            @RequestBody UserUpdateRequest request
            ) {
        System.out.println(email);
        User updatedUser = userService.updateUser(email,request);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/user/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email , HttpServletResponse response){
        userService.softDeleteUser(email);

        // HttpOnly 쿠키 삭제
        ResponseCookie accessCookie = ResponseCookie.from("accessToken" ,"")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // 만료
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken" , "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) //리프레시도 만료
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE , refreshCookie.toString());

        //프런트에서 삭제할수 있도록 Set-Cookie 응답 설정

        return ResponseEntity.ok("회원가입 탈퇴성공");
    }

    @PutMapping("/user/restore/{email}")
    public ResponseEntity<String> restoreUser(@PathVariable String email){
        userService.restoreUser(email);
        return ResponseEntity.ok("회원복구 성공");
    }
}
