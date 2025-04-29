package com.example.userservice.service;

import com.example.userservice.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ScheduledTasksService {

    private final UserRepository userRepository;

    public ScheduledTasksService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void deleteOlDeletedUsers() {
        LocalDateTime oneDaysAgo = LocalDateTime.now().minusDays(1);
        System.out.println("스케쥴링 실행: 하루 지난 유저 , 기준날짜:" + oneDaysAgo);

        int deletedCount =  userRepository.deleteUSerScheduled(oneDaysAgo);
        System.out.println("삭제된 유저:" +deletedCount);
    }
}
