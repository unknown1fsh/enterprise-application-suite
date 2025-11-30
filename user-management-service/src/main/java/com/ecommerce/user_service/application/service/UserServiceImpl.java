package com.ecommerce.user_service.application.service;

import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.mapper.GenericMapper;
import com.ecommerce.user_service.application.dto.LoginRequestDTO;
import com.ecommerce.user_service.application.dto.LoginResponseDTO;
import com.ecommerce.user_service.application.dto.UserDTO;
import com.ecommerce.user_service.application.dto.UserRequestDTO;
import com.ecommerce.user_service.domain.entity.User;
import com.ecommerce.user_service.domain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl extends com.ecommerce.common.service.GenericServiceImpl<User, Long, UserDTO> implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, 
                          GenericMapper<User, Long, UserDTO> mapper,
                          PasswordEncoder passwordEncoder) {
        super(userRepository, mapper);
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDTO register(UserRequestDTO request) {
        if (userRepository.existsByUsernameAndDeletedFalse(request.getUsername())) {
            throw new BusinessException("Username already exists", "USERNAME_EXISTS");
        }
        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new BusinessException("Email already exists", "EMAIL_EXISTS");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : User.UserRole.USER);
        user.setActive(true);

        user = userRepository.save(user);
        return mapper.toDTO(user);
    }

    @Override
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByUsernameOrEmailAndDeletedFalse(
                request.getUsernameOrEmail(), 
                request.getUsernameOrEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "usernameOrEmail", request.getUsernameOrEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("Invalid password", "INVALID_PASSWORD");
        }

        if (!user.getActive()) {
            throw new BusinessException("User account is inactive", "ACCOUNT_INACTIVE");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = "mock-jwt-token-" + user.getId();

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(mapper.toDTO(user));
        response.setMessage("Login successful");

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findByUsername(String username) {
        return userRepository.findByUsernameAndDeletedFalse(username)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO findByEmail(String email) {
        return userRepository.findByEmailAndDeletedFalse(email)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsernameAndDeletedFalse(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailAndDeletedFalse(email);
    }
}

