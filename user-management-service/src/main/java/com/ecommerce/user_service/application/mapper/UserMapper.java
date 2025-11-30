package com.ecommerce.user_service.application.mapper;

import com.ecommerce.common.mapper.BaseMapper;
import com.ecommerce.user_service.application.dto.UserDTO;
import com.ecommerce.user_service.domain.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper extends BaseMapper<User, Long, UserDTO> {

    @Override
    protected UserDTO createDTO() {
        return new UserDTO();
    }

    @Override
    protected User createEntity() {
        return new User();
    }

    @Override
    protected void mapEntityToDTO(User entity, UserDTO dto) {
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setRole(entity.getRole());
        dto.setActive(entity.getActive());
        dto.setLastLogin(entity.getLastLogin());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setVersion(entity.getVersion());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setUpdatedBy(entity.getUpdatedBy());
    }

    @Override
    protected void mapDTOToEntity(UserDTO dto, User entity) {
        if (dto.getUsername() != null) entity.setUsername(dto.getUsername());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getFirstName() != null) entity.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) entity.setLastName(dto.getLastName());
        if (dto.getRole() != null) entity.setRole(dto.getRole());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
        if (dto.getLastLogin() != null) entity.setLastLogin(dto.getLastLogin());
    }
}

