package com.example.be.dto.seller;

import com.example.be.dto.user.UserProfileDto;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SellerProfileDto {
    private Long id;
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
    private UserProfileDto user;
}
