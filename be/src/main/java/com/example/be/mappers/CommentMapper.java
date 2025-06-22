package com.example.be.mappers;

import com.example.be.dto.user.CommentDto;
import com.example.be.entities.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentDto entityToDto(Comment comment);
}
