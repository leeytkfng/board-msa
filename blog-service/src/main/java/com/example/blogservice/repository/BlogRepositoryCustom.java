package com.example.blogservice.repository;

import com.example.blogservice.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogRepositoryCustom {
    Page<BlogPost> searchByKeyWord(String keyword, Pageable pageable);
}
