package com.example.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserLoginResponseDto {
    private UserInfo user;
    private String accessToken;

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    public static class UserInfo {
        private Long id;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime lastActive;
        private String firstName;
        private String lastName;
    }
}
