package com.ecommerce.payment_service.application.mapper;

import com.ecommerce.common.mapper.BaseMapper;
import com.ecommerce.payment_service.application.dto.PaymentDTO;
import com.ecommerce.payment_service.domain.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper extends BaseMapper<Payment, Long, PaymentDTO> {

    @Override
    protected PaymentDTO createDTO() {
        return new PaymentDTO();
    }

    @Override
    protected Payment createEntity() {
        return new Payment();
    }

    @Override
    protected void mapEntityToDTO(Payment entity, PaymentDTO dto) {
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrderId());
        dto.setUserId(entity.getUserId());
        dto.setAmount(entity.getAmount());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setStatus(entity.getStatus());
        dto.setTransactionDate(entity.getTransactionDate());
        dto.setTransactionId(entity.getTransactionId());
        dto.setPaymentGatewayResponse(entity.getPaymentGatewayResponse());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setVersion(entity.getVersion());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setUpdatedBy(entity.getUpdatedBy());
    }

    @Override
    protected void mapDTOToEntity(PaymentDTO dto, Payment entity) {
        if (dto.getOrderId() != null) entity.setOrderId(dto.getOrderId());
        if (dto.getUserId() != null) entity.setUserId(dto.getUserId());
        if (dto.getAmount() != null) entity.setAmount(dto.getAmount());
        if (dto.getPaymentMethod() != null) entity.setPaymentMethod(dto.getPaymentMethod());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getTransactionDate() != null) entity.setTransactionDate(dto.getTransactionDate());
        if (dto.getTransactionId() != null) entity.setTransactionId(dto.getTransactionId());
        if (dto.getPaymentGatewayResponse() != null) entity.setPaymentGatewayResponse(dto.getPaymentGatewayResponse());
    }
}

