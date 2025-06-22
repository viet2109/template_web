package com.example.be.dto.admin;

import com.example.be.dto.common.UserBasicDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CouponUsageDto {
    private Long id;
    private AdminCouponDto coupon;
    private UserBasicDto user;
    private Long orderId;
    private Double discountAmount;
    private LocalDateTime usedAt;
}

