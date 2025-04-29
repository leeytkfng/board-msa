package com.example.blogservice.controller;


import com.example.blogservice.config.CustomUserDetails;
import com.example.blogservice.dto.BlogDto;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.service.BlogUpdateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class BlogUpdateController {

    private final BlogUpdateService blogUpdateService;

    public BlogUpdateController(BlogUpdateService blogUpdateService){
        this.blogUpdateService = blogUpdateService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlogPost(
            @PathVariable Long id,
            @RequestBody BlogDto dto ,
            Authentication authentication
            ) {
        if(authentication == null || !authentication.isAuthenticated()){
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername(); //email 가져와서 검증

        BlogPost updatedBLog = blogUpdateService.updateBlog(id,dto,email);

        if(updatedBLog != null){
            return ResponseEntity.ok(updatedBLog);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); //권한없음으로 나타냄
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(
            @PathVariable Long id,
            Authentication authentication
    ) {
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        boolean isDeleted = blogUpdateService.deleteBlog(id,email);

        if(isDeleted){
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
