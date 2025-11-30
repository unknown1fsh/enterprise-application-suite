package com.ecommerce.order_service.application.service;

import com.ecommerce.common.service.GenericService;
import com.ecommerce.order_service.application.dto.OrderDTO;
import com.ecommerce.order_service.domain.entity.Order;
import com.ecommerce.order_service.domain.entity.Order.OrderStatus;

import java.util.List;

public interface OrderService extends GenericService<Order, Long, OrderDTO> {
    
    OrderDTO createOrder(com.ecommerce.order_service.application.dto.OrderRequestDTO request);
    
    OrderDTO updateOrderStatus(Long id, OrderStatus status);
    
    List<OrderDTO> findByUserId(Long userId);
    
    List<OrderDTO> findByStatus(OrderStatus status);
    
    OrderDTO findByIdAndUserId(Long id, Long userId);
}

