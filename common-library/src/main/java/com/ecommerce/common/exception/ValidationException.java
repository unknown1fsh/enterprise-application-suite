package com.ecommerce.common.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends BusinessException {
    private final List<String> validationErrors;

    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
        this.validationErrors = List.of(message);
    }

    public ValidationException(String message, List<String> validationErrors) {
        super(message, "VALIDATION_ERROR");
        this.validationErrors = validationErrors;
    }
}

