package com.ecommerce.inventory_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InventoryController {

    @GetMapping("/inventory/health")
    public String healthCheck() {
        return "Inventory Service is up and running!";
    }
}
