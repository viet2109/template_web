package com.example.be.dto.admin;

import com.example.be.dto.common.FileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminBasicDto {
    private Long id;
    private String firstName;
    private String lastName;
    private FileDto avatar;
    private String email;
}
