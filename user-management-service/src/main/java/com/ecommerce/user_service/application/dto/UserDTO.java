package com.ecommerce.user_service.application.dto;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.user_service.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO extends BaseDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private User.UserRole role;
    private Boolean active;
    private LocalDateTime lastLogin;
}

