package com.crypto.project.dto.response;

import lombok.Data;

@Data
public class MessageDto {
    private String senderUsername;
    private String receiverUsername;
    private String encryptedText;
}
