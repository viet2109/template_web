package com.example.be.mappers;

import com.example.be.dto.request.UserSignUpRequest;
import com.example.be.dto.response.UserLoginResponseDto;
import com.example.be.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User dtoToEntity(UserSignUpRequest dto);
    UserLoginResponseDto.UserInfo entityToDto(User user);
}
