package com.crypto.project.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ErrorResponseDTO(
        Integer status,
        String error,
        String message,
        String errorDetail,
        String path,
        LocalDateTime timestamp) {
}
