package com.ecommerce.payment_service.application.service;

import com.ecommerce.common.service.GenericService;
import com.ecommerce.payment_service.application.dto.PaymentDTO;
import com.ecommerce.payment_service.application.dto.PaymentRequestDTO;
import com.ecommerce.payment_service.domain.entity.Payment;
import com.ecommerce.payment_service.domain.entity.Payment.PaymentStatus;

import java.util.List;

public interface PaymentService extends GenericService<Payment, Long, PaymentDTO> {
    
    PaymentDTO processPayment(PaymentRequestDTO request);
    
    PaymentDTO updatePaymentStatus(Long id, PaymentStatus status);
    
    List<PaymentDTO> findByOrderId(Long orderId);
    
    List<PaymentDTO> findByUserId(Long userId);
    
    List<PaymentDTO> findByStatus(PaymentStatus status);
    
    PaymentDTO findByTransactionId(String transactionId);
}

