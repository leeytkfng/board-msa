package com.example.userservice.service;

import com.example.userservice.auth.CustomUserDetails;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        //유저를 찾을수없을경우 예외처리
        User user =optionalUser.orElseThrow(() ->
                new UsernameNotFoundException("사용자 정보 처리 불가"));

//        String role = user.getEmail() != null ? user.getRole()

        return new CustomUserDetails(user.getEmail(),user.getPassword(),user.getRole());
        //MyBatis로 가져온 사용자 정보 반환
    }
}
