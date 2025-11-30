package com.ecommerce.inventory_service.application.mapper;

import com.ecommerce.common.mapper.BaseMapper;
import com.ecommerce.inventory_service.application.dto.ProductDTO;
import com.ecommerce.inventory_service.domain.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper extends BaseMapper<Product, Long, ProductDTO> {

    @Override
    protected ProductDTO createDTO() {
        return new ProductDTO();
    }

    @Override
    protected Product createEntity() {
        return new Product();
    }

    @Override
    protected void mapEntityToDTO(Product entity, ProductDTO dto) {
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setCategory(entity.getCategory());
        dto.setSku(entity.getSku());
        dto.setImageUrl(entity.getImageUrl());
        dto.setActive(entity.getActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setVersion(entity.getVersion());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setUpdatedBy(entity.getUpdatedBy());
    }

    @Override
    protected void mapDTOToEntity(ProductDTO dto, Product entity) {
        if (dto.getName() != null) entity.setName(dto.getName());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getPrice() != null) entity.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) entity.setStockQuantity(dto.getStockQuantity());
        if (dto.getCategory() != null) entity.setCategory(dto.getCategory());
        if (dto.getSku() != null) entity.setSku(dto.getSku());
        if (dto.getImageUrl() != null) entity.setImageUrl(dto.getImageUrl());
        if (dto.getActive() != null) entity.setActive(dto.getActive());
    }
}

