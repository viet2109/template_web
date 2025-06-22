package com.example.be.dto.user;

import com.example.be.dto.common.UserBasicDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WishlistDto {
    private Long id;
    private UserBasicDto user;
    private TemplateCardDto template;
    private LocalDateTime createdAt;
}
