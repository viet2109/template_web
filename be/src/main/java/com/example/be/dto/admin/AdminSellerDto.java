package com.example.be.dto.admin;

import com.example.be.dto.common.UserBasicDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminSellerDto {
    private Long id;
    private UserBasicDto user;
    private String name;
    private String description;
    private String portfolioUrl;
    private String website;
    private Integer totalReviews;
    private Double totalSales;
    private Double rating;
    private String taxId;
    private Double commissionRate;
    private String bankAccount;
    private String bankName;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalTemplates;
    private Integer approvedTemplates;
    private Integer pendingTemplates;
    private Integer rejectedTemplates;
}

