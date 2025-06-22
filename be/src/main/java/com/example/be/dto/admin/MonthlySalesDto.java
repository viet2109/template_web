package com.example.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MonthlySalesDto {
    private String month;
    private Integer totalSales;
    private Double totalRevenue;
}
