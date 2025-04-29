package com.example.userservice.service;


import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class SearchService {
    private final UserRepository userRepository;

    public SearchService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email){
        return userRepository.findAllByEmail(email);
    }
}
