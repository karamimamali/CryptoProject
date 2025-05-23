package com.crypto.project.dao.repository;


import com.crypto.project.dao.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    @Query("SELECT u.password FROM User u WHERE u.username = :username")
    String getUserPasswordByUsername(@Param("username") String username);
}
