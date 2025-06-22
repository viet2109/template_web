package com.example.be.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserUpdateProfileDto {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    private String phone;

    private MultipartFile avatar;
}
