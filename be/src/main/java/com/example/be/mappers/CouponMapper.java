package com.example.be.mappers;

import com.example.be.dto.admin.AdminCouponDto;
import com.example.be.entities.Coupon;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CouponMapper {
    AdminCouponDto entityToDto(Coupon coupon);
}
