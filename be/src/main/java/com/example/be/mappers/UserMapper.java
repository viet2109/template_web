package com.example.be.mappers;

import com.example.be.dto.admin.AdminUserDto;
import com.example.be.dto.common.UserBasicDto;
import com.example.be.dto.user.UserProfileDto;
import com.example.be.dto.user.UserRegisterDto;
import com.example.be.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User dtoToEntity(UserRegisterDto dto);

    UserProfileDto entityToDto(User user);

    AdminUserDto entityToAdminDto(User user);
}
