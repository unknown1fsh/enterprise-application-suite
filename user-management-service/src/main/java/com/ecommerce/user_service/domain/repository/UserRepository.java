package com.ecommerce.user_service.domain.repository;

import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.user_service.domain.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends GenericRepository<User, Long> {
    
    Optional<User> findByUsernameAndDeletedFalse(String username);
    
    Optional<User> findByEmailAndDeletedFalse(String email);
    
    Optional<User> findByUsernameOrEmailAndDeletedFalse(String username, String email);
    
    boolean existsByUsernameAndDeletedFalse(String username);
    
    boolean existsByEmailAndDeletedFalse(String email);
}

