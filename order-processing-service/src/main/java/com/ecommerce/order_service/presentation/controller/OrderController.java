package com.ecommerce.order_service.presentation.controller;

import com.ecommerce.common.controller.GenericController;
import com.ecommerce.common.response.ApiResponse;
import com.ecommerce.order_service.application.dto.OrderDTO;
import com.ecommerce.order_service.application.dto.OrderRequestDTO;
import com.ecommerce.order_service.application.service.OrderService;
import com.ecommerce.order_service.domain.entity.Order;
import com.ecommerce.order_service.domain.entity.Order.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order/orders")
public class OrderController extends GenericController<Order, Long, OrderDTO> {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        super(orderService);
        this.orderService = orderService;
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> create(@Valid @RequestBody OrderDTO dto) {
        OrderDTO created = orderService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", created));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(@Valid @RequestBody OrderRequestDTO request) {
        OrderDTO created = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", created));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        OrderDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.findByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderDTO> orders = orderService.findByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByIdAndUserId(
            @PathVariable Long id,
            @PathVariable Long userId) {
        OrderDTO order = orderService.findByIdAndUserId(id, userId);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Order Service is up and running!"));
    }
}

