package com.example.blogservice.service;

import com.example.blogservice.dto.UserRequestDto;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.entity.Category;
import com.example.blogservice.repository.BlogRepository;
import com.example.blogservice.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;

    private final UserClient userClient;

    public BlogService (BlogRepository blogRepository,CategoryRepository categoryRepository, UserClient userClient){
        this.blogRepository = blogRepository;
        this.categoryRepository =categoryRepository;
        this.userClient = userClient;
    }

    @Transactional
    public BlogPost savePost(String title, String content , String email , String  categoryName) {
        //이메일로 사용자 조회
        UserRequestDto user = userClient.getUserByEmail(email);
        if(user == null || user.isDeleted()){
            throw new RuntimeException("사용자를 찾을수없습니다.");
        }

        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("카테고리가 없습니다."));

        //블로그 글생성 및 저장하는 로직
        BlogPost post = new BlogPost(title,content,email,category);
        return blogRepository.save(post);
    }

    @Transactional
    public void getBlogById(Long postId) {
        BlogPost post = blogRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않습니다"));


        System.out.println("조회수 증가 실행전:"+ post.getViewCount());
        post.setViewCount(post.getViewCount() + 1);
        //변경 감지(dirty checking) -> 트랜잭션(데이터베이스 작업 단위)가 끝나면 자동으로 update

        //blogRepository.save(post)를 하지않아도,트랜잭션이 종료될경우 변경사항이 DB에 반영 / flush()

        System.out.println("증가된 조회수:" +post.getViewCount());
    }
}
