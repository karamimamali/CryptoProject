package com.crypto.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterUserRequestDTO(
        @NotNull
        String username,

        @NotNull
        @NotBlank
        String password,

        @NotNull
        @NotBlank
        String publicKey
) {
}
