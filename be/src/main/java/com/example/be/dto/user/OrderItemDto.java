package com.example.be.dto.user;

import com.example.be.enums.LicenseType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderItemDto {
    private Long id;
    private TemplateCardDto template;
    private BigDecimal price;
    private LicenseType licenseType;
    private LocalDateTime createdAt;
    private Boolean isReviewed;
}
