package com.example.be.dto.admin;

import com.example.be.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateCouponDto {
    @NotBlank(message = "Coupon code is required")
    @Size(max = 50, message = "Code must not exceed 50 characters")
    private String code;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.0", message = "Discount value must be non-negative")
    private Double discountValue;

    @DecimalMin(value = "0.0", message = "Minimum amount must be non-negative")
    private Double minimumAmount = 0.0;

    @DecimalMin(value = "0.0", message = "Maximum discount must be non-negative")
    private Double maximumDiscount;

    @Min(value = 1, message = "Usage limit must be at least 1")
    private Integer usageLimit;

    @Min(value = 1, message = "User limit must be at least 1")
    private Integer userLimit = 1;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private Boolean isActive = true;
}

