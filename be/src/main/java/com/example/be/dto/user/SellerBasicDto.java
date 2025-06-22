package com.example.be.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SellerBasicDto {
    private Long id;
    private String name;
    private String description;
    private Double rating;
    private Integer totalReviews;
    private Double totalSales;
    private String portfolioUrl;
    private String website;
}
