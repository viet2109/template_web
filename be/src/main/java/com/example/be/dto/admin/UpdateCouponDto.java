package com.example.be.dto.admin;

import com.example.be.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateCouponDto {
    private String code;
    private String description;
    private DiscountType discountType;
    private Double discountValue;
    private Double minimumAmount;
    private Double maximumDiscount;
    private Integer usageLimit;
    private Integer userLimit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
}

