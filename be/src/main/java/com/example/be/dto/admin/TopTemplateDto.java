package com.example.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TopTemplateDto {
    private Long id;
    private String name;
    private String sellerName;
    private Integer totalSales;
    private Double totalRevenue;
    private Double rating;
}
