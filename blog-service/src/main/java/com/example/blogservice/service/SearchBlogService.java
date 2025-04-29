package com.example.blogservice.service;

import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.repository.BlogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SearchBlogService {

    private final BlogRepository blogRepository;

    public SearchBlogService(BlogRepository blogRepository){
        this.blogRepository =blogRepository;
    }

    @Transactional(readOnly = true) //1차 캐시 활성화 되서 여러번 조회해도 DB 조회 X //프록시 생성.
    public Page<BlogPost> getBlogsByUser(String email ,Pageable pageable) {
        return blogRepository.findByUserEmail(email ,pageable);
    }

    public BlogPost getBlogsById(Long id){
        Optional<BlogPost> blogPost = blogRepository.findByIdWithCategory(id);
        return blogPost.orElse(null);
    }

    public Page<BlogPost> searchBlogs(String keyword , Pageable pageable) {
        System.out.println("검색요청: keyword=" +keyword);
        Page<BlogPost> results = blogRepository.searchByKeyWord(keyword,pageable);
        System.out.println("검색 결과 개수:" + results.getTotalElements()); //로그 추가
        return results;
    }

    public Page<BlogPost> getAllBlogs(Pageable pageable){
        return blogRepository.findAll(pageable);
    }

    public Page<BlogPost> getBlogsByCategory_Name(String category , Pageable pageable){
        return blogRepository.findByCategory_Name(category,pageable);
    }
}
