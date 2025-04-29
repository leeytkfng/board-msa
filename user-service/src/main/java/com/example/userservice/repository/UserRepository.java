package com.example.userservice.repository;

import com.example.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //삭제되지 않은 유저만 조회
    Optional<User> findByEmail(String email);

    User findAllByEmail(String email);

    //삭제된 유저도 조회하도록 (관리자용)
    @Query("select u from User u where u.email = :email")
    Optional<User> findByEmailIncludingDeleted(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u where u.deletedAt is not null and u.deletedAt <= :threshold")
    int deleteUSerScheduled(@Param("threshold") LocalDateTime threshold);

}
