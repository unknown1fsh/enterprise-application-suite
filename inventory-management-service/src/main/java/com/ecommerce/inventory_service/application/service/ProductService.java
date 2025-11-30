package com.ecommerce.inventory_service.application.service;

import com.ecommerce.common.service.GenericService;
import com.ecommerce.inventory_service.application.dto.ProductDTO;
import com.ecommerce.inventory_service.domain.entity.Product;

public interface ProductService extends GenericService<Product, Long, ProductDTO> {
    
    ProductDTO updateStock(Long id, Integer quantity);
    
    ProductDTO findBySku(String sku);
    
    java.util.List<ProductDTO> findByCategory(String category);
    
    java.util.List<ProductDTO> searchByName(String name);
    
    java.util.List<ProductDTO> findActiveProducts();
}

