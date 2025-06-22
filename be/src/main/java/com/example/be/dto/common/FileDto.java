package com.example.be.dto.common;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private Long id;
    private String name;
    private String path;
    private String type;
    private Long size;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
