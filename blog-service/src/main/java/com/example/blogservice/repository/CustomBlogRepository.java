package com.example.blogservice.repository;

import com.example.blogservice.entity.BlogPost;
import java.util.List;

public interface CustomBlogRepository {
    List<BlogPost> findLimitedBlogs(int limit);
}
