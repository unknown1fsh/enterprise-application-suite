package com.ecommerce.order_service.application.service;

import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.mapper.GenericMapper;
import com.ecommerce.order_service.application.dto.OrderDTO;
import com.ecommerce.order_service.application.dto.OrderItemRequestDTO;
import com.ecommerce.order_service.application.dto.OrderRequestDTO;
import com.ecommerce.order_service.domain.entity.Order;
import com.ecommerce.order_service.domain.entity.OrderItem;
import com.ecommerce.order_service.domain.entity.Order.OrderStatus;
import com.ecommerce.order_service.domain.repository.OrderItemRepository;
import com.ecommerce.order_service.domain.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl extends com.ecommerce.common.service.GenericServiceImpl<Order, Long, OrderDTO> implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderServiceImpl(OrderRepository orderRepository, 
                           OrderItemRepository orderItemRepository,
                           GenericMapper<Order, Long, OrderDTO> mapper) {
        super(orderRepository, mapper);
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderRequestDTO request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        order.setBillingAddress(request.getBillingAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequestDTO itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(itemRequest.getProductId());
            item.setProductName("Product " + itemRequest.getProductId()); // Should fetch from inventory service
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(BigDecimal.valueOf(100)); // Should fetch from inventory service
            item.calculateSubtotal();
            totalAmount = totalAmount.add(item.getSubtotal());
            order.getItems().add(item);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        return mapper.toDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapper.toDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> findByUserId(Long userId) {
        return orderRepository.findByUserIdAndDeletedFalse(userId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> findByStatus(OrderStatus status) {
        return orderRepository.findByStatusAndDeletedFalse(status).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO findByIdAndUserId(Long id, Long userId) {
        return orderRepository.findByIdAndUserIdAndDeletedFalse(id, userId)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }
}

