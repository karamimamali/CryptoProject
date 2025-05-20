package com.crypto.project.dao.repository;

import com.crypto.project.dao.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Fetch messages between two users ordered by timestamp ascending
    List<Message> findBySenderUsernameAndReceiverUsernameOrderByTimestampAsc(String senderUsername, String receiverUsername);

    // Also fetch messages where sender and receiver are swapped (conversation both ways)
    List<Message> findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
            String senderUsername1, String receiverUsername1, String senderUsername2, String receiverUsername2);


}
