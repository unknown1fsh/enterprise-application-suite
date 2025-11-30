package com.ecommerce.common.specification;

import com.ecommerce.common.dto.FilterDTO;
import com.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SpecificationBuilder {

    public static <T extends BaseEntity<ID>, ID extends Serializable> Specification<T> build(FilterDTO filterDTO) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude deleted records
            predicates.add(criteriaBuilder.equal(root.get("deleted"), false));

            if (filterDTO == null || filterDTO.getFilters() == null || filterDTO.getFilters().isEmpty()) {
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }

            Map<String, Object> filters = filterDTO.getFilters();

            for (Map.Entry<String, Object> entry : filters.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();

                if (value == null) {
                    continue;
                }

                if (key.contains(".")) {
                    // Handle nested properties (e.g., "user.name")
                    String[] parts = key.split("\\.");
                    if (parts.length == 2) {
                        predicates.add(criteriaBuilder.equal(
                                root.get(parts[0]).get(parts[1]),
                                value
                        ));
                    }
                } else if (value instanceof String) {
                    // String contains (LIKE)
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get(key)),
                            "%" + value.toString().toLowerCase() + "%"
                    ));
                } else {
                    // Exact match
                    predicates.add(criteriaBuilder.equal(root.get(key), value));
                }
            }

            // Search term (searches in common fields)
            if (filterDTO.getSearchTerm() != null && !filterDTO.getSearchTerm().isEmpty()) {
                String searchTerm = filterDTO.getSearchTerm().toLowerCase();
                // This is a simple implementation - can be extended
                Predicate searchPredicate = criteriaBuilder.or(
                        // Add common searchable fields here
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("id").as(String.class)), "%" + searchTerm + "%")
                );
                predicates.add(searchPredicate);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

