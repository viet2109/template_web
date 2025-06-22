package com.example.be.dto.admin;

import com.example.be.enums.OrderStatus;
import com.example.be.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateOrderStatusDto {
    @NotNull
    private OrderStatus status;

    @NotNull
    private PaymentStatus paymentStatus;

    private String notes;
}

