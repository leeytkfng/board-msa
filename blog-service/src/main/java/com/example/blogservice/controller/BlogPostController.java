package com.example.blogservice.controller;

import com.example.blogservice.config.CustomUserDetails;
import com.example.blogservice.dto.BlogDto;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
public class BlogPostController {

    private final BlogService blogService;

    public BlogPostController (BlogService blogService){
        this.blogService =blogService;
    }


    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody BlogDto blogDto ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("controller 에서 인증객체 SecurityContextHolder:" + authentication);

        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(401).body("로그인이 안되어있음");
        }
        Object principal = authentication.getPrincipal();
        if(!(principal instanceof CustomUserDetails)) {
            return ResponseEntity.status(401).body("잘못된인증");
        }

        CustomUserDetails userDetails = (CustomUserDetails) principal;
        String email = userDetails.getUsername();
        String category = blogDto.getCategory(); // 카테고리ID 가져오기

        if(category == null){
            return ResponseEntity.status(400).body("카테고리 ID 가없습니다");
        }

        System.out.println("현재 로그인한 사용자:"+ email);
        BlogPost savePost = blogService.savePost(blogDto.getTitle(),blogDto.getContent(),email , category);
        return ResponseEntity.ok(savePost);

    }

}
