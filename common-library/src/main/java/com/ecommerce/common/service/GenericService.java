package com.ecommerce.common.service;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.common.dto.FilterDTO;
import com.ecommerce.common.dto.PageableDTO;
import com.ecommerce.common.entity.BaseEntity;
import com.ecommerce.common.response.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

public interface GenericService<T extends BaseEntity<ID>, ID extends Serializable, DTO extends BaseDTO> {
    
    DTO create(DTO dto);
    
    DTO update(ID id, DTO dto);
    
    void delete(ID id);
    
    void softDelete(ID id);
    
    Optional<DTO> findById(ID id);
    
    List<DTO> findAll();
    
    PagedResponse<DTO> findAll(PageableDTO pageableDTO);
    
    PagedResponse<DTO> findAll(FilterDTO filterDTO);
    
    long count();
    
    boolean existsById(ID id);
}

