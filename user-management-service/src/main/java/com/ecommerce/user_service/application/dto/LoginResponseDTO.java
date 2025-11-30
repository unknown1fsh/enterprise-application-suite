package com.ecommerce.user_service.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token; // JWT token - will be implemented later
    private UserDTO user;
    private String message;
}

