package com.ecommerce.inventory_service.domain.repository;

import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.inventory_service.domain.entity.Product;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends GenericRepository<Product, Long> {
    
    Optional<Product> findBySkuAndDeletedFalse(String sku);
    
    List<Product> findByCategoryAndDeletedFalseAndActiveTrue(String category);
    
    List<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name);
    
    List<Product> findByActiveTrueAndDeletedFalse();
}

