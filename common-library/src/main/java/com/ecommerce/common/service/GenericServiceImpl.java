package com.ecommerce.common.service;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.common.dto.FilterDTO;
import com.ecommerce.common.dto.PageableDTO;
import com.ecommerce.common.entity.BaseEntity;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.mapper.GenericMapper;
import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.common.response.PagedResponse;
import com.ecommerce.common.specification.SpecificationBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public abstract class GenericServiceImpl<T extends BaseEntity<ID>, ID extends Serializable, DTO extends BaseDTO>
        implements GenericService<T, ID, DTO> {

    protected final GenericRepository<T, ID> repository;
    protected final GenericMapper<T, ID, DTO> mapper;

    public GenericServiceImpl(GenericRepository<T, ID> repository, GenericMapper<T, ID, DTO> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public DTO create(DTO dto) {
        T entity = mapper.toEntity(dto);
        entity = repository.save(entity);
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public DTO update(ID id, DTO dto) {
        T entity = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", "id", id));
        mapper.updateEntityFromDTO(dto, entity);
        entity = repository.save(entity);
        return mapper.toDTO(entity);
    }

    @Override
    @Transactional
    public void delete(ID id) {
        T entity = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", "id", id));
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void softDelete(ID id) {
        T entity = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", "id", id));
        entity.setDeleted(true);
        repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DTO> findById(ID id) {
        return repository.findByIdAndDeletedFalse(id)
                .map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DTO> findAll() {
        return repository.findAllByDeletedFalse().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DTO> findAll(PageableDTO pageableDTO) {
        Sort sort = createSort(pageableDTO);
        Pageable pageable = PageRequest.of(
                pageableDTO.getPage(),
                pageableDTO.getSize(),
                sort
        );
        Page<T> page = repository.findAllByDeletedFalse(pageable);
        return PagedResponse.of(
                page.getContent().stream().map(mapper::toDTO).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<DTO> findAll(FilterDTO filterDTO) {
        Specification<T> spec = SpecificationBuilder.build(filterDTO);
        Sort sort = createSort(filterDTO.getPageable());
        Pageable pageable = PageRequest.of(
                filterDTO.getPageable().getPage(),
                filterDTO.getPageable().getSize(),
                sort
        );
        Page<T> page = repository.findAll(spec, pageable);
        return PagedResponse.of(
                page.getContent().stream().map(mapper::toDTO).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return repository.countByDeletedFalse();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        return repository.findByIdAndDeletedFalse(id).isPresent();
    }

    protected Sort createSort(PageableDTO pageableDTO) {
        if (pageableDTO.getSortBy() == null || pageableDTO.getSortBy().isEmpty()) {
            return Sort.unsorted();
        }
        Sort.Direction direction = "DESC".equalsIgnoreCase(pageableDTO.getSortDirection())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        return Sort.by(direction, pageableDTO.getSortBy());
    }
}

