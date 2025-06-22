package com.example.be.dto.seller;

import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PayoutStatus;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PayoutDto {
    private Long id;
    private Double amount;
    private String currency;
    private PayoutStatus status;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String notes;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}
