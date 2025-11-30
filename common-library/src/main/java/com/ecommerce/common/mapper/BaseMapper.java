package com.ecommerce.common.mapper;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.common.entity.BaseEntity;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseMapper<T extends BaseEntity<ID>, ID extends Serializable, DTO extends BaseDTO>
        implements GenericMapper<T, ID, DTO> {

    @Override
    public DTO toDTO(T entity) {
        if (entity == null) {
            return null;
        }
        DTO dto = createDTO();
        mapEntityToDTO(entity, dto);
        return dto;
    }

    @Override
    public T toEntity(DTO dto) {
        if (dto == null) {
            return null;
        }
        T entity = createEntity();
        mapDTOToEntity(dto, entity);
        return entity;
    }

    @Override
    public void updateEntityFromDTO(DTO dto, T entity) {
        if (dto == null || entity == null) {
            return;
        }
        mapDTOToEntity(dto, entity);
    }

    @Override
    public List<DTO> toDTOList(List<T> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<T> toEntityList(List<DTO> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    protected abstract DTO createDTO();
    protected abstract T createEntity();
    protected abstract void mapEntityToDTO(T entity, DTO dto);
    protected abstract void mapDTOToEntity(DTO dto, T entity);
}

