package com.example.be.mappers;

import com.example.be.dto.user.ReviewDto;
import com.example.be.entities.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewsMapper {
    ReviewDto entityToDto(Review review);
}
