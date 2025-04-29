package com.example.blogservice.repository;

import com.example.blogservice.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BlogRepository extends JpaRepository<BlogPost, Long> ,BlogRepositoryCustom {
    Page<BlogPost> findAll(Pageable pageable);

    //Containing(%keyword%) //특정 단어 포함
    //EndWith(%keyword) 끝나는 단어
    //StartWith(keyword%) //시작 단어
    //like(like :keyword) 유사한 단어

    Page<BlogPost> findByUserEmail(String st, Pageable pageable);

    Page<BlogPost> findByCategory_Name(String category, Pageable pageable);

    @Query("SELECT b from BlogPost b join fetch b.category where b.id = :postId")
    Optional<BlogPost> findByIdWithCategory(@Param("postId") Long postId);
}
