package com.ecommerce.common.mapper;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.common.entity.BaseEntity;

import java.io.Serializable;
import java.util.List;

public interface GenericMapper<T extends BaseEntity<ID>, ID extends Serializable, DTO extends BaseDTO> {
    
    DTO toDTO(T entity);
    
    T toEntity(DTO dto);
    
    void updateEntityFromDTO(DTO dto, T entity);
    
    List<DTO> toDTOList(List<T> entities);
    
    List<T> toEntityList(List<DTO> dtos);
}

