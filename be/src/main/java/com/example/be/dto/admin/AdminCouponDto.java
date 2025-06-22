package com.example.be.dto.admin;

import com.example.be.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminCouponDto {
    private Long id;
    private String code;
    private String description;
    private DiscountType discountType;
    private Double discountValue;
    private Double minimumAmount;
    private Double maximumDiscount;
    private Integer usageLimit;
    private Integer usedCount;
    private Integer userLimit;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Page<CouponUsageDto> couponUsagesPage;
}

