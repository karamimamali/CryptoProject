package com.crypto.project.service;

import com.crypto.project.dao.entity.Message;
import com.crypto.project.dao.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * Send (save) a new encrypted message.
     */
    public Message sendMessage(String senderUsername, String receiverUsername, String encryptedText) {
        Message message = new Message()
                .setSenderUsername(senderUsername)
                .setReceiverUsername(receiverUsername)
                .setEncryptedText(encryptedText);
        return messageRepository.save(message);
    }

    /**
     * Retrieve full conversation between two users sorted by timestamp ascending.
     */
    public List<Message> getConversation(String userA, String userB) {
        return messageRepository.findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
                userA, userB, userB, userA
        );
    }

}
