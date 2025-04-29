package com.example.blogservice.controller;

import com.example.blogservice.config.CustomUserDetails;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.service.BlogService;
import com.example.blogservice.service.SearchBlogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class BlogGetController {

    private final SearchBlogService searchBlogService;
    private final BlogService blogService;

    public BlogGetController(SearchBlogService searchBlogService ,BlogService blogService){
        this.searchBlogService =searchBlogService;
        this.blogService = blogService;
    }

    //특정 블로그 리스트 가져오기 (사용자 따라)
    @GetMapping("/my-blogs")
    public ResponseEntity<Page<BlogPost>> getMyBlogs (Authentication authentication,
                                                   @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
                                                      ){
        if(authentication  == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        Page<BlogPost> blogPosts = searchBlogService.getBlogsByUser(email ,pageable);//이메일에 따른 블로그 리스트 가져오기
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/blog/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id){
        System.out.println("블로그 조회 요청됨:ID= "+ id);
        blogService.getBlogById(id);
        BlogPost blogPost = searchBlogService.getBlogsById(id);

        //조회수 증가 실행

        if(blogPost == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("블로그 게시글을 찾을수 없습니다."); //없으면 404
        }
        System.out.println("반환되는 블로그 정보:"+ blogPost + blogPost.getViewCount());
        return ResponseEntity.ok(blogPost);
    }

    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogPost>> getAllBlogs(Pageable pageable) {
        Page<BlogPost> blogs = searchBlogService.getAllBlogs(pageable);
        return  ResponseEntity.ok(blogs);
    }

    @GetMapping("/search") ///api/search?keyword=검색어&page=0&size=10
    public ResponseEntity<Page<BlogPost>> searchBlogs(@RequestParam(required = false) String keyword
            ,@RequestParam(required = false) String category, Pageable pageable){
        System.out.println("검색 API 호출됨:" + keyword);

        Page<BlogPost> posts;

        if(category != null && !category.isEmpty()){
            posts = searchBlogService.getBlogsByCategory_Name(category,pageable);
        } else if (keyword != null && !keyword.isEmpty()){
            posts = searchBlogService.searchBlogs(keyword, pageable);
        } else {
            posts =Page.empty();
        }

        return ResponseEntity.ok(posts);

    }



}
