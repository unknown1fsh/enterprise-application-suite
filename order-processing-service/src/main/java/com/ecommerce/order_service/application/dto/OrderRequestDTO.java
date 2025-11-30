package com.ecommerce.order_service.application.dto;

import com.ecommerce.order_service.domain.entity.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    
    @NotNull(message = "User ID is required")
    private Long userId;

    private String shippingAddress;
    private String billingAddress;

    @NotEmpty(message = "Order items are required")
    @Valid
    private List<OrderItemRequestDTO> items;
}

