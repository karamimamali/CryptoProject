package com.crypto.project.controller;

import com.crypto.project.dao.entity.Message;
import com.crypto.project.dto.response.MessageDto;
import com.crypto.project.service.MessageService;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Comparator;

@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Endpoint to send a new encrypted message.
     * POST /api/messages/send
     */
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageDto messageDto) {
        Message savedMessage = messageService.sendMessage(
                messageDto.getSenderUsername(),
                messageDto.getReceiverUsername(),
                messageDto.getEncryptedText()
        );
        return ResponseEntity.ok(savedMessage);
    }

    /**
     * Endpoint to get conversation history between two users.
     * GET /api/messages/conversation?userA=xxx&userB=yyy
     */
    @GetMapping("/history")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {
        // Get messages sent from user1 to user2
        List<Message> user1ToUser2 = messageService.getConversation(user1, user2);

        // Get messages sent from user2 to user1
        List<Message> user2ToUser1 = messageService.getConversation(user2, user1);

        // Combine both lists
        List<Message> completeConversation = new ArrayList<>();
        completeConversation.addAll(user1ToUser2);
        completeConversation.addAll(user2ToUser1);

        // Sort the combined list by timestamp to show messages in chronological order
        completeConversation.sort(Comparator.comparing(Message::getTimestamp));

        return ResponseEntity.ok(completeConversation);
    }
}
