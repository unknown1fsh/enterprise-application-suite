package com.ecommerce.order_service.domain.repository;

import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.order_service.domain.entity.Order;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends GenericRepository<Order, Long> {
    
    List<Order> findByUserIdAndDeletedFalse(Long userId);
    
    List<Order> findByStatusAndDeletedFalse(Order.OrderStatus status);
    
    Optional<Order> findByIdAndUserIdAndDeletedFalse(Long id, Long userId);
}

