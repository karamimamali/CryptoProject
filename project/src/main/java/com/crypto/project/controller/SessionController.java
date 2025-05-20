package com.crypto.project.controller;

import com.crypto.project.dto.request.RequestSessionDTO;
import com.crypto.project.dto.response.CaesarKeyResponseDTO;
import com.crypto.project.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/session")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/request")
    public ResponseEntity<CaesarKeyResponseDTO> requestSession(@RequestBody RequestSessionDTO request) {
        CaesarKeyResponseDTO response = sessionService.generateEncryptedCaesarKey(
                request.getSenderUsername(),
                request.getReceiverUsername()
        );
        return ResponseEntity.ok(response);
    }
}