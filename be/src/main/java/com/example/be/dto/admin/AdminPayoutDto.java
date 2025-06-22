package com.example.be.dto.admin;

import com.example.be.dto.user.SellerBasicDto;
import com.example.be.enums.PaymentMethod;
import com.example.be.enums.PayoutStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminPayoutDto {
    private Long id;
    private SellerBasicDto seller;
    private Double amount;
    private String currency;
    private PayoutStatus status;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String notes;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}

