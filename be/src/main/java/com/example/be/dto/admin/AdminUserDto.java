package com.example.be.dto.admin;

import com.example.be.dto.common.FileDto;
import com.example.be.dto.seller.SellerProfileDto;
import com.example.be.enums.AuthProvider;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminUserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private FileDto avatar;
    private AuthProvider provider;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserStatus status;
    private Set<Role> roles;
    private SellerProfileDto sellerProfile;
    private Integer totalOrders;
    private Double totalSpent;
}

