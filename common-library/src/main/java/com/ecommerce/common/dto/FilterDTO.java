package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterDTO implements Serializable {
    private Map<String, Object> filters;
    private String searchTerm;
    private PageableDTO pageable;
}

