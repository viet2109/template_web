package com.example.be.dto.user;

import com.example.be.enums.DiscountType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CouponDto {
    private String code;
    private String description;
    private DiscountType discountType;
    private Double discountValue;
    private Double minimumAmount;
    private Double maximumDiscount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
