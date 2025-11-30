package com.ecommerce.payment_service.domain.repository;

import com.ecommerce.common.repository.GenericRepository;
import com.ecommerce.payment_service.domain.entity.Payment;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends GenericRepository<Payment, Long> {
    
    List<Payment> findByOrderIdAndDeletedFalse(Long orderId);
    
    List<Payment> findByUserIdAndDeletedFalse(Long userId);
    
    List<Payment> findByStatusAndDeletedFalse(Payment.PaymentStatus status);
    
    Optional<Payment> findByTransactionIdAndDeletedFalse(String transactionId);
}

