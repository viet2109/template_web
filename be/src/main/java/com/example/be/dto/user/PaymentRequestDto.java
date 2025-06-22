package com.example.be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private Long orderId;
    private BigDecimal amount;
}
