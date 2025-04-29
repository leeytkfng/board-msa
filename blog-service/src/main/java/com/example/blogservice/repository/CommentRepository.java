package com.example.blogservice.repository;

import com.example.blogservice.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {
    // 게시글에 달린 댓글목록 조회

    List<Comment> findByPostId(Long postId); //fetch join 하기전 네이밍jpa

    @Query("SELECT c from Comment c where c.post.id = :postId")
    List<Comment> findByPostIdWithUser(@Param("postId") Long postId);
    //fetch join  문으로 기존의 join으로 1개의 블로그만 가져오는거 + 여러개의 데이터 n개로 n+1문제가 발생
    // joinfetch 문으로 블로그 , 사용자 , 댓글 , 작성자 다가져오기 단! 필요한곳에만쓰기
}
