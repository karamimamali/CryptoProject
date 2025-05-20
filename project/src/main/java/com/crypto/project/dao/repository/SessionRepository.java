
package com.crypto.project.dao.repository;

import com.crypto.project.dao.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Long> {

    Optional<SessionEntity> findBySenderUsernameAndReceiverUsername(String senderUsername, String receiverUsername);
}