package com.example.be.dto.admin;

import com.example.be.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CategorySalesDto {
    private Category category;

    private Integer totalSales;

    private double totalRevenue;
}

