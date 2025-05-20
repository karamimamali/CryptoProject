package com.crypto.project.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StatusEnum {
    SUCCESS("Success"),
    BAD_REQUEST("Request parameters invalid"),
    NOT_FOUND("Record not found"),
    SERVICE_FAILED("Service failed"),
    VALIDATION_FAILED("Validation rules violated");

    private final String message;
}
