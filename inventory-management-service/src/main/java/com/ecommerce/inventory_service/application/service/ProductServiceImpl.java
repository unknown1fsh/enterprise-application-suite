package com.ecommerce.inventory_service.application.service;

import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.mapper.GenericMapper;
import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.common.service.GenericServiceImpl;
import com.ecommerce.inventory_service.application.dto.ProductDTO;
import com.ecommerce.inventory_service.domain.entity.Product;
import com.ecommerce.inventory_service.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl extends GenericServiceImpl<Product, Long, ProductDTO> implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository, GenericMapper<Product, Long, ProductDTO> mapper) {
        super(productRepository, mapper);
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public ProductDTO updateStock(Long id, Integer quantity) {
        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        if (product.getStockQuantity() + quantity < 0) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }
        
        product.setStockQuantity(product.getStockQuantity() + quantity);
        product = productRepository.save(product);
        return mapper.toDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO findBySku(String sku) {
        return productRepository.findBySkuAndDeletedFalse(sku)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findByCategory(String category) {
        return productRepository.findByCategoryAndDeletedFalseAndActiveTrue(category).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCaseAndDeletedFalse(name).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findActiveProducts() {
        return productRepository.findByActiveTrueAndDeletedFalse().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}

