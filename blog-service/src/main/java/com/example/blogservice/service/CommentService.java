package com.example.blogservice.service;

import com.example.blogservice.dto.UserRequestDto;
import com.example.blogservice.entity.BlogPost;
import com.example.blogservice.entity.Comment;
import com.example.blogservice.repository.BlogRepository;
import com.example.blogservice.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserClient userClient;

    public CommentService(CommentRepository commentRepository , BlogRepository blogRepository, UserClient userClient) {
        this.blogRepository =blogRepository;
        this.commentRepository =commentRepository;
        this.userClient =userClient;
    }

    @Transactional
    public Comment saveComment (Long postId,String email, String comment) {
        System.out.println("🔍 댓글 작성 요청: postId=" + postId + ", email=" + email + ", content=" + comment);

        BlogPost post = blogRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("블로그가 없습니다"));

        UserRequestDto user = userClient.getUserByEmail(email);

        Comment comment1 = new Comment();
        comment1.setContent(comment);
        comment1.setPost(post);
        comment1.setUserEmail(user.getEmail());

        return commentRepository.save(comment1);
    }

    public List<Comment> getCommentByPost(Long postId) {
        return commentRepository.findByPostIdWithUser(postId);
    }

    @Transactional
    public Comment updateComment (Long commentId, String newComment){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 찾을수없음"));
        comment.setContent(newComment);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(()->
                new IllegalArgumentException("사용자 x"));
        commentRepository.delete(comment);
    }
}
