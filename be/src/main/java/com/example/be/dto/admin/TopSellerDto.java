package com.example.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TopSellerDto {
    private Long id;
    private String name;
    private Double totalSales;
    private Integer totalTemplates;
    private Double rating;
}
