package com.crypto.project.dao.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Accessors(chain = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "message")
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "sender_username")
    String senderUsername;

    @Column(name = "receiver_username")
    String receiverUsername;

    @Column(name = "ecrypted_text", columnDefinition = "TEXT")
    String encryptedText;

    @Column(name = "timestamp")
    LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
