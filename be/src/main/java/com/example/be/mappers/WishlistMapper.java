package com.example.be.mappers;

import com.example.be.dto.admin.AdminTemplateDto;
import com.example.be.dto.seller.CreateTemplateDto;
import com.example.be.dto.user.TemplateCardDto;
import com.example.be.dto.user.TemplateDetailDto;
import com.example.be.dto.user.WishlistDto;
import com.example.be.entities.Template;
import com.example.be.entities.Wishlist;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WishlistMapper {
    WishlistDto entityToDto(Wishlist wishlist);
}
