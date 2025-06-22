package com.example.be.dto.seller;

import com.example.be.enums.Category;
import com.example.be.enums.Color;
import com.example.be.enums.LicenseType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateTemplateDto {
    @NotBlank(message = "Template name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    private Set<Color> colors;

    @Builder.Default
    private Boolean isFree = false;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discount price must be non-negative")
    private BigDecimal discountPrice;

    private String techStack;
    private String features;
    private String compatibility;

    @URL(message = "Invalid demo URL format")
    private String demoUrl;

    @Builder.Default
    private LicenseType licenseType = LicenseType.SINGLE;

    @Min(value = 1, message = "Max purchases must be at least 1")
    private Integer maxPurchases;

    @NotNull(message = "DownloadFile is required")
    private MultipartFile downloadFile;
    private MultipartFile thumbnailFile;
}
