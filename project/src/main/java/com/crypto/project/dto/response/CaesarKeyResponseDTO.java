// CaesarKeyResponseDTO.java
package com.crypto.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaesarKeyResponseDTO {
    private String caesarKey;
}