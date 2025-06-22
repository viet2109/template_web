package com.example.be.dto.seller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SellerRegisterDto {
    @NotBlank(message = "Seller name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @URL(message = "Invalid portfolio URL format")
    private String portfolioUrl;

    @URL(message = "Invalid website URL format")
    private String website;

    @NotBlank(message = "Tax id is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid tax ID format")
    private String taxId;

    @NotBlank(message = "Bank account is required")
    @Pattern(regexp = "^[0-9]{10,16}$", message = "Invalid bank account format")
    private String bankAccount;

    @NotBlank(message = "Bank name is required")
    private String bankName;
}
