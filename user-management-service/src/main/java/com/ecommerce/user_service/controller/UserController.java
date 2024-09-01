package com.ecommerce.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/user/health")
    public String healthCheck() {
        return "User Service is up and running!";
    }
}
