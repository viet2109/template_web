package com.example.be.dto.seller;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SalesReportDto {
    private Long id;
    private LocalDateTime reportDate;
    private Double totalSales;
    private Integer totalOrders;
    private Double commissionAmount;
    private Double netEarnings;
    private LocalDateTime createdAt;
}
