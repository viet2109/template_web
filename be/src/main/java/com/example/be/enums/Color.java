package com.example.be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Color {
    BLUE("#007bff"),
    RED("#dc3545"),
    GREEN("#28a745"),
    ORANGE("#fd7e14"),
    PURPLE("#6f42c1"),
    TEAL("#20c997"),
    PINK("#e83e8c"),
    YELLOW("#ffc107"),
    BLACK("#000000"),
    WHITE("#ffffff"),
    GRAY("#6c757d");

    private final String hexCode;
}

