package com.example.be.dto.seller;

import com.example.be.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PayoutRequestDto {
    @NotNull
    @Min(10000)
    private Double amount;
    @NotBlank
    private PaymentMethod paymentMethod;
    private String notes;
}
