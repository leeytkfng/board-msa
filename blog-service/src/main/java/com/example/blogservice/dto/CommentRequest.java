package com.example.blogservice.dto;


public record CommentRequest(Long postId, String email, String content) {
}