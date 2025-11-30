package com.ecommerce.payment_service.application.service;

import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.common.mapper.GenericMapper;
import com.ecommerce.payment_service.application.dto.PaymentDTO;
import com.ecommerce.payment_service.application.dto.PaymentRequestDTO;
import com.ecommerce.payment_service.domain.entity.Payment;
import com.ecommerce.payment_service.domain.entity.Payment.PaymentStatus;
import com.ecommerce.payment_service.domain.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl extends com.ecommerce.common.service.GenericServiceImpl<Payment, Long, PaymentDTO> implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, GenericMapper<Payment, Long, PaymentDTO> mapper) {
        super(paymentRepository, mapper);
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional
    public PaymentDTO processPayment(PaymentRequestDTO request) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PROCESSING);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString());

        // Simulate payment gateway processing
        try {
            // Mock payment processing - in real scenario, call payment gateway
            Thread.sleep(100); // Simulate network delay
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaymentGatewayResponse("Payment processed successfully");
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setPaymentGatewayResponse("Payment processing failed: " + e.getMessage());
        }

        payment = paymentRepository.save(payment);
        return mapper.toDTO(payment);
    }

    @Override
    @Transactional
    public PaymentDTO updatePaymentStatus(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        payment.setStatus(status);
        payment = paymentRepository.save(payment);
        return mapper.toDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> findByOrderId(Long orderId) {
        return paymentRepository.findByOrderIdAndDeletedFalse(orderId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> findByUserId(Long userId) {
        return paymentRepository.findByUserIdAndDeletedFalse(userId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> findByStatus(PaymentStatus status) {
        return paymentRepository.findByStatusAndDeletedFalse(status).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO findByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionIdAndDeletedFalse(transactionId)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionId", transactionId));
    }
}

