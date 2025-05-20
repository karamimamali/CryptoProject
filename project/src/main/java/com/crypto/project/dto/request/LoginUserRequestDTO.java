package com.crypto.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginUserRequestDTO(
        @NotNull
        @NotBlank
        String username,

        @NotNull
        @NotBlank
        String password
) {
}
