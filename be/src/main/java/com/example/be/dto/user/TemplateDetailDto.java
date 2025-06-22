package com.example.be.dto.user;

import com.example.be.dto.common.FileDto;
import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.LicenseType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TemplateDetailDto {
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
    private FileDto thumbnailFile;
    private String demoUrl;
    private SellerBasicDto seller;
    private LicenseType licenseType;
    private LocalDateTime createdAt;
    private Boolean isInWishlist;
    private Boolean isPurchased;
    private Page<ReviewDto> reviewDtoPage;
    private Page<CommentDto> commentDtoPage;
}
