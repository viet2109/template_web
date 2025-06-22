package com.example.be.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CouponUsageBasicDto {
    private Long id;
    private CouponBasicDto coupon;
    private Double discountAmount;
    private LocalDateTime usedAt;
}
