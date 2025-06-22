package com.example.be.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailNotificationDto {
    private String to;
    private String from;
    private String subject;
    private String body;
    private boolean html = false;
}
