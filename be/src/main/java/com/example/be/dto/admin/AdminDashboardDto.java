package com.example.be.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminDashboardDto {
    private Integer totalUsers;
    private Integer totalSellers;
    private Integer totalTemplates;
    private Integer totalOrders;
    private Double totalRevenue;
    private Double totalCommissions;
    private Integer newUsersThisMonth;
    private Integer newSellersThisMonth;
    private Integer newTemplatesThisMonth;
    private Integer newOrdersThisMonth;
    private List<CategorySalesDto> categorySales;
    private List<MonthlySalesDto> monthlySales;
    private List<TopSellerDto> topSellers;
    private List<TopTemplateDto> topTemplates;
}

