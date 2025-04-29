package com.example.userservice.controller;

import com.example.userservice.entity.User;
import com.example.userservice.service.SearchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService){
        this.searchService =searchService;
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email){
        System.out.println("요청된 이메일: " + email);
        return searchService.getUserByEmail(email);
    }
}
