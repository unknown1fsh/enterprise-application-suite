package com.ecommerce.payment_service.application.dto;

import com.ecommerce.common.dto.BaseDTO;
import com.ecommerce.payment_service.domain.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO extends BaseDTO {
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private Payment.PaymentMethod paymentMethod;
    private Payment.PaymentStatus status;
    private LocalDateTime transactionDate;
    private String transactionId;
    private String paymentGatewayResponse;
}

