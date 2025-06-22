package com.example.be.dto.user;

import com.example.be.dto.common.FileDto;
import com.example.be.enums.AuthProvider;
import com.example.be.enums.Role;
import com.example.be.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private FileDto avatar;
    private UserStatus status;
    private AuthProvider provider;
    private Set<Role> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
