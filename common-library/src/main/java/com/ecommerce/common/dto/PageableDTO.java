package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageableDTO implements Serializable {
    
    @Min(value = 0, message = "Page number must be greater than or equal to 0")
    private Integer page = 0;

    @Min(value = 1, message = "Page size must be greater than 0")
    @Max(value = 100, message = "Page size must be less than or equal to 100")
    private Integer size = 20;

    private String sortBy;
    private String sortDirection = "ASC"; // ASC or DESC
}

