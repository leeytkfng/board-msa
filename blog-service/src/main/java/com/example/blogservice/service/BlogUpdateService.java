package com.example.blogservice.service;


import com.example.blogservice.dto.BlogDto;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.repository.BlogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BlogUpdateService {
    private final BlogRepository blogRepository;

    public BlogUpdateService (BlogRepository blogRepository){
        this.blogRepository = blogRepository;
    }

    @Transactional
    public BlogPost updateBlog(Long id, BlogDto dto ,String email){
        BlogPost blogPost = blogRepository.findById(id).orElseThrow(()->new IllegalArgumentException("블로그글이 존재치 않습니다."));

        if(!blogPost.getUserEmail().equals(email)){
            return null;
        }

        blogPost.setTitle(dto.getTitle());
        blogPost.setContent(dto.getContent());
        return blogPost;
    }


    @Transactional
    public boolean deleteBlog(Long id, String email) {
        BlogPost blogPost = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("블로그를 찾을수없습니다."));

        //작성자와 현재 로그인한 사용자가 같은 지 확인
        if(!blogPost.getUserEmail().equals(email)){
            return false; // 권한ㅇ벗음.
        }

        blogRepository.delete(blogPost); //삭제
        return true;
    }
}
