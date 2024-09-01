package com.ecommerce.payment_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    @GetMapping("/payment/health")
    public String healthCheck() {
        return "Payment Service is up and running!";
    }
}
