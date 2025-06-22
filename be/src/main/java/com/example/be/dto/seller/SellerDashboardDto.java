package com.example.be.dto.seller;

import lombok.*;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SellerDashboardDto {
    private Double totalEarnings;
    private Integer totalSales;
    private Integer totalTemplates;
    private Integer pendingTemplates;
    private Integer approvedTemplates;
    private Integer rejectedTemplates;
    private Double averageRating;
    private Integer totalReviews;
    private List<SalesReportDto> recentSales;
    private List<SellerTemplateDto> topSellingTemplates;
}
