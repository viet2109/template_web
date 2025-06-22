package com.example.be.mappers;

import com.example.be.dto.admin.AdminSellerDto;
import com.example.be.dto.seller.SellerProfileDto;
import com.example.be.dto.user.SellerBasicDto;
import com.example.be.entities.SellerProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SellerProfileMapper {
    SellerProfileDto entityToDto(SellerProfile sellerProfile);

    SellerBasicDto entityToBasicDto(SellerProfile sellerProfile);

    AdminSellerDto entityToAdminDto(SellerProfile sellerProfile);
}
