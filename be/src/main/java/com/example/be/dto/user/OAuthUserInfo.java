package com.example.be.dto.user;

public interface OAuthUserInfo {
    String getEmail();

    String getFirstName();

    String getLastName();

    String getProviderId();

    String getAvatarUrl();
}