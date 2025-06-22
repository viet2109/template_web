package com.example.be.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBasicDto {
    private Long id;
    private String firstName;
    private String lastName;
    private FileDto avatar;
}
