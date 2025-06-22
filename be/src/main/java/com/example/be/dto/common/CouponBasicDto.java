package com.example.be.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CouponBasicDto {
    private Long id;
    private String code;
    private Integer usageLimit;
    private Integer usedCount;
}
