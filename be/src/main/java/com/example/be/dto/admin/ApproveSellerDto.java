package com.example.be.dto.admin;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApproveSellerDto {
    @NotNull(message = "Approval status is required")
    private Boolean isApproved;

    private String reason;

    @DecimalMin(value = "0.0", message = "Commission rate must be ≥ 0")
    @DecimalMax(value = "100.0", message = "Commission rate must be ≤ 100")
    private Double commissionRate;
}
