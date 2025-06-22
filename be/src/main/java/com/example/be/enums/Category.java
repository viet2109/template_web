package com.example.be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Category {
    LANDING_PAGE("Landing Page"),
    E_COMMERCE("E-commerce"),
    PORTFOLIO("Portfolio"),
    BLOG("Blog"),
    BUSINESS("Business"),
    ADMIN_DASHBOARD("Admin Dashboard"),
    CRM("CRM"),
    CMS("CMS"),
    OTHER("Other");

    private final String displayName;
}
