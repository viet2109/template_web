package com.example.be.mappers;

import com.example.be.dto.admin.CouponUsageDto;
import com.example.be.entities.CouponUsage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CouponUsageMapper {
    CouponUsageDto entityToDto(CouponUsage coupon);
}
