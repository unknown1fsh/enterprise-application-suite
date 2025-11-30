package com.ecommerce.order_service.domain.repository;

import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.order_service.domain.entity.OrderItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends GenericRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderIdAndDeletedFalse(Long orderId);
}

