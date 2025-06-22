package com.example.be.dto.admin;

import com.example.be.dto.user.TemplateCardDto;
import com.example.be.enums.LicenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminOrderItemDto {
    private Long id;
    private TemplateCardDto template;
    private BigDecimal price;
    private LicenseType licenseType;
    private Double commissionRate;
    private LocalDateTime createdAt;
}
