package com.example.be.dto.seller;

import com.example.be.dto.common.FileDto;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.LicenseType;
import com.example.be.enums.TemplateStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SellerTemplateDto {
    private Long id;
    private String name;
    private String description;
    private Category category;
    private Set<Color> colors;
    private Boolean isFree;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String techStack;
    private String features;
    private String compatibility;
    private Integer totalSales;
    private Integer totalDownloads;
    private Double rating;
    private Integer totalReviews;
    private Integer totalComments;
    private Integer maxPurchases;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private String demoUrl;
    private FileDto downloadFile;
    private FileDto thumbnailFile;
    private TemplateStatus status;
    private String rejectionReason;
    private LicenseType licenseType;
}
