package com.ecommerce.common.repository;

import com.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

import java.io.Serializable;

public class GenericRepositoryImpl<T extends BaseEntity<ID>, ID extends Serializable>
        extends SimpleJpaRepository<T, ID> implements GenericRepository<T, ID> {

    private final EntityManager entityManager;

    public GenericRepositoryImpl(JpaEntityInformation<T, ID> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
    }

    @Override
    public java.util.Optional<T> findByIdAndDeletedFalse(ID id) {
        Specification<T> spec = (root, query, cb) -> 
            cb.and(
                cb.equal(root.get("id"), id),
                cb.equal(root.get("deleted"), false)
            );
        return findOne(spec);
    }

    @Override
    public java.util.List<T> findAllByDeletedFalse() {
        Specification<T> spec = (root, query, cb) -> cb.equal(root.get("deleted"), false);
        return findAll(spec);
    }

    @Override
    public Page<T> findAllByDeletedFalse(Pageable pageable) {
        Specification<T> spec = (root, query, cb) -> cb.equal(root.get("deleted"), false);
        return findAll(spec, pageable);
    }

    @Override
    public long countByDeletedFalse() {
        return count((root, query, cb) -> cb.equal(root.get("deleted"), false));
    }
}

