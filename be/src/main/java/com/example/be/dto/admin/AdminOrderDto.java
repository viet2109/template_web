package com.example.be.dto.admin;

import com.example.be.dto.common.UserBasicDto;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminOrderDto {
    private Long id;
    private UserAdminBasicDto user;
    private Double taxAmount;
    private String currency;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String paymentTransactionId;
    private String billingInfo;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private List<AdminOrderItemDto> orderItems;
    private List<CouponUsageDto> couponUsages;
}

