package com.ecommerce.order_service.application.mapper;

import com.ecommerce.common.mapper.BaseMapper;
import com.ecommerce.order_service.application.dto.OrderDTO;
import com.ecommerce.order_service.application.dto.OrderItemDTO;
import com.ecommerce.order_service.domain.entity.Order;
import com.ecommerce.order_service.domain.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper extends BaseMapper<Order, Long, OrderDTO> {

    private final OrderItemMapper itemMapper = new OrderItemMapper();

    @Override
    protected OrderDTO createDTO() {
        return new OrderDTO();
    }

    @Override
    protected Order createEntity() {
        return new Order();
    }

    @Override
    protected void mapEntityToDTO(Order entity, OrderDTO dto) {
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setOrderDate(entity.getOrderDate());
        dto.setStatus(entity.getStatus());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setShippingAddress(entity.getShippingAddress());
        dto.setBillingAddress(entity.getBillingAddress());
        if (entity.getItems() != null) {
            dto.setItems(entity.getItems().stream()
                    .map(itemMapper::toDTO)
                    .collect(Collectors.toList()));
        }
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setVersion(entity.getVersion());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setUpdatedBy(entity.getUpdatedBy());
    }

    @Override
    protected void mapDTOToEntity(OrderDTO dto, Order entity) {
        if (dto.getUserId() != null) entity.setUserId(dto.getUserId());
        if (dto.getOrderDate() != null) entity.setOrderDate(dto.getOrderDate());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getTotalAmount() != null) entity.setTotalAmount(dto.getTotalAmount());
        if (dto.getShippingAddress() != null) entity.setShippingAddress(dto.getShippingAddress());
        if (dto.getBillingAddress() != null) entity.setBillingAddress(dto.getBillingAddress());
    }

    private static class OrderItemMapper {
        OrderItemDTO toDTO(OrderItem entity) {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setId(entity.getId());
            dto.setOrderId(entity.getOrder().getId());
            dto.setProductId(entity.getProductId());
            dto.setProductName(entity.getProductName());
            dto.setQuantity(entity.getQuantity());
            dto.setPrice(entity.getPrice());
            dto.setSubtotal(entity.getSubtotal());
            return dto;
        }
    }
}

