package com.example.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminOrderAnalyticsDto {
    private Integer totalOrders;
    private Integer totalCompletedOrders;
    private Integer totalPendingOrders;
    private BigDecimal revenue;
}
