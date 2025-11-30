package com.ecommerce.common.controller;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.common.dto.FilterDTO;
import com.ecommerce.common.dto.PageableDTO;
import com.ecommerce.common.entity.BaseEntity;
import com.ecommerce.common.response.ApiResponse;
import com.ecommerce.common.response.PagedResponse;
import com.ecommerce.common.service.GenericService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;

public abstract class GenericController<T extends BaseEntity<ID>, ID extends Serializable, DTO extends BaseDTO> {

    protected final GenericService<T, ID, DTO> service;

    public GenericController(GenericService<T, ID, DTO> service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DTO>> create(@Valid @RequestBody DTO dto) {
        DTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DTO>> update(
            @PathVariable ID id,
            @Valid @RequestBody DTO dto) {
        DTO updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
    }

    @DeleteMapping("/{id}/soft")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable ID id) {
        service.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success("Resource soft deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DTO>> findById(@PathVariable ID id) {
        return service.findById(id)
                .map(dto -> ResponseEntity.ok(ApiResponse.success(dto)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DTO>>> findAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        
        PageableDTO pageableDTO = new PageableDTO();
        if (page != null) pageableDTO.setPage(page);
        if (size != null) pageableDTO.setSize(size);
        if (sortBy != null) pageableDTO.setSortBy(sortBy);
        if (sortDirection != null) pageableDTO.setSortDirection(sortDirection);

        PagedResponse<DTO> result = service.findAll(pageableDTO);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<DTO>>> search(@RequestBody FilterDTO filterDTO) {
        PagedResponse<DTO> result = service.findAll(filterDTO);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> count() {
        return ResponseEntity.ok(ApiResponse.success(service.count()));
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<ApiResponse<Boolean>> existsById(@PathVariable ID id) {
        return ResponseEntity.ok(ApiResponse.success(service.existsById(id)));
    }
}

