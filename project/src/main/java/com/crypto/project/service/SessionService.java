package com.crypto.project.service;

import com.crypto.project.dao.entity.SessionEntity;
import com.crypto.project.dao.entity.User;
import com.crypto.project.dao.repository.SessionRepository;
import com.crypto.project.dao.repository.UserRepository;
import com.crypto.project.dto.response.CaesarKeyResponseDTO;
import com.crypto.project.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final EncryptionUtil encryptionUtil;
    private final UserRepository userRepository;

    public CaesarKeyResponseDTO generateEncryptedCaesarKey(String senderUsername, String receiverUsername) {
        // First, check if there's an existing session between these users
        Optional<SessionEntity> existingSession = sessionRepository.findBySenderUsernameAndReceiverUsername(
                senderUsername, receiverUsername);

        // Also check if there's a session where the roles are reversed
        if (!existingSession.isPresent()) {
            existingSession = sessionRepository.findBySenderUsernameAndReceiverUsername(
                    receiverUsername, senderUsername);
        }

        if (existingSession.isPresent()) {
            // A session already exists
            SessionEntity session = existingSession.get();

            // Determine which key to return based on who is requesting
            String encryptedKey;
            if (senderUsername.equals(session.getSenderUsername())) {
                encryptedKey = session.getEncryptedCaesarKeyForSender();
            } else {
                encryptedKey = session.getEncryptedCaesarKeyForReceiver();
            }

            return CaesarKeyResponseDTO.builder()
                    .caesarKey(encryptedKey)
                    .build();
        } else {
            // No session exists, create a new one
            String rawCaesarKey = generateRandomCaesarKey();

            // Fetch users
            User sender = userRepository.findByUsername(senderUsername)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            User receiver = userRepository.findByUsername(receiverUsername)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            // Encrypt Caesar key using public RSA keys
            String encryptedKeyForSender = encryptionUtil.encryptWithRSAPublicKey(rawCaesarKey, sender.getPublicKey());
            String encryptedKeyForReceiver = encryptionUtil.encryptWithRSAPublicKey(rawCaesarKey, receiver.getPublicKey());

            // Create and save the new session
            SessionEntity newSession = SessionEntity.builder()
                    .senderUsername(senderUsername)
                    .receiverUsername(receiverUsername)
                    .encryptedCaesarKeyForSender(encryptedKeyForSender)
                    .encryptedCaesarKeyForReceiver(encryptedKeyForReceiver)
                    .build();

            sessionRepository.save(newSession);

            // Return the encrypted key for the sender
            return CaesarKeyResponseDTO.builder()
                    .caesarKey(encryptedKeyForSender)
                    .build();
        }
    }

    private String generateRandomCaesarKey() {
        SecureRandom random = new SecureRandom();
        int shift = random.nextInt(25) + 1; // Range: 1 to 25
        return String.valueOf(shift);       // e.g., "3", "15", etc.
    }

}
