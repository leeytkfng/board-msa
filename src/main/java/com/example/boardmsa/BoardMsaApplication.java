package com.example.boardmsa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class BoardMsaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardMsaApplication.class, args);
    }

}
