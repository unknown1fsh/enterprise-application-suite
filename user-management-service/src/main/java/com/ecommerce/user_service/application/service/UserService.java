package com.ecommerce.user_service.application.service;

import com.ecommerce.common.service.GenericService;
import com.ecommerce.user_service.application.dto.LoginRequestDTO;
import com.ecommerce.user_service.application.dto.LoginResponseDTO;
import com.ecommerce.user_service.application.dto.UserDTO;
import com.ecommerce.user_service.application.dto.UserRequestDTO;
import com.ecommerce.user_service.domain.entity.User;

public interface UserService extends GenericService<User, Long, UserDTO> {
    
    UserDTO register(UserRequestDTO request);
    
    LoginResponseDTO login(LoginRequestDTO request);
    
    UserDTO findByUsername(String username);
    
    UserDTO findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}

