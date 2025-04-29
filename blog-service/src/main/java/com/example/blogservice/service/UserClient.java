package com.example.blogservice.service;

import com.example.blogservice.dto.UserRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/api/users/{email}")
    UserRequestDto getUserByEmail(@PathVariable("email") String email);
}
