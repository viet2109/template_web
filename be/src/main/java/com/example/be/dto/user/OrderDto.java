package com.example.be.dto.user;

import com.example.be.dto.common.CouponUsageBasicDto;
import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDto {
    private Long id;
    private Double taxAmount;
    private String currency;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String paymentTransactionId;
    private String billingInfo;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private List<OrderItemDto> orderItems;
    private List<CouponUsageBasicDto> couponUsages;
}
