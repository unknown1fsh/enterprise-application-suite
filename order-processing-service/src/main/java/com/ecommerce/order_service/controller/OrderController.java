package com.ecommerce.order_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderController {

    @GetMapping("/order/health")
    public String healthCheck() {
        return "Order Service is up and running!";
    }
}
