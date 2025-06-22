package com.example.be.mappers;

import com.example.be.dto.user.CartItemDto;
import com.example.be.entities.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartItemDto entityToDto(CartItem cartItem);
}
