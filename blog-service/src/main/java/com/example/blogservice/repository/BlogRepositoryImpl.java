package com.example.blogservice.repository;

import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.entity.QBlogPost;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BlogRepositoryImpl implements BlogRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public BlogRepositoryImpl(EntityManager entityManager){
        this.jpaQueryFactory =new JPAQueryFactory(entityManager);
    }


    @Override
    public Page<BlogPost> searchByKeyWord(String keyword, Pageable pageable) {

        QBlogPost blogPost = QBlogPost.blogPost;

        List<BlogPost> results = jpaQueryFactory
                .selectFrom(blogPost)
                .where(blogPost.title.containsIgnoreCase(keyword).or(
                        blogPost.content.containsIgnoreCase(keyword)
                ))
                .offset(pageable.getOffset()) //현재 페이지 위치
                .limit(pageable.getPageSize()) //한페이당 보여질 개수
                .fetch();

        long total = jpaQueryFactory
                .select(blogPost.count())
                .from(blogPost)
                .where(blogPost.title.containsIgnoreCase(keyword).or(
                        blogPost.content.containsIgnoreCase(keyword)
                )).fetchOne();

        return new PageImpl<>(results,pageable,total);
    }
}