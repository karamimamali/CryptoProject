package com.crypto.project.dao.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_username")
    private String senderUsername;
    @Column(name = "receiver_username")
    private String receiverUsername;

    @Column(name = "encrypted_caesar_key_for_sender")
    private String encryptedCaesarKeyForSender;
    @Column(name = "encrypted_caesar_key_for_receiver")
    private String encryptedCaesarKeyForReceiver;
}
