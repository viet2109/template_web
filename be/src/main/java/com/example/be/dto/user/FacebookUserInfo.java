package com.example.be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacebookUserInfo implements OAuthUserInfo {
    private String id; // Facebook user ID
    private String email;
    private String firstName;
    private String lastName;
    private String picture; // Avatar URL

    @Override
    public String getProviderId() {
        return id;
    }

    @Override
    public String getAvatarUrl() {
        return picture;
    }

}
