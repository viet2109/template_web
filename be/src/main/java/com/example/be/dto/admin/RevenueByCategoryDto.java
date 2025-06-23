package com.example.be.dto.admin;

import com.example.be.enums.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RevenueByCategoryDto {
    private Category category;
    private BigDecimal revenue;

    public RevenueByCategoryDto(String category, BigDecimal revenue) {
        this.category = category != null
                ? Category.valueOf(category)
                : null;
        this.revenue = revenue;
    }

}
