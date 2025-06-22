package com.example.be.dto.user;

import com.example.be.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderDto {
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "Billing info is required")
    private String billingInfo;
    private String notes;
    private String couponCode;

    @NotNull(message = "CartItemIds is required")
    @Size(min = 1, message = "CartItemIds can not be empty")
    private Set<Long> cartItemIds;
}
