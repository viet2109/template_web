package com.example.be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleUserInfo implements OAuthUserInfo {
    private String sub; // Google user ID
    private String email;
    private String givenName; // First name
    private String familyName; // Last name
    private String picture; // Avatar URL
    private boolean emailVerified;

    @Override
    public String getFirstName() {
        return givenName;
    }

    @Override
    public String getLastName() {
        return familyName;
    }

    @Override
    public String getProviderId() {
        return sub;
    }

    @Override
    public String getAvatarUrl() {
        return picture;
    }
}
