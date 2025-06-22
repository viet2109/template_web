package com.example.be.mappers;

import com.example.be.dto.admin.AdminOrderDto;
import com.example.be.dto.user.OrderDto;
import com.example.be.entities.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    AdminOrderDto entityToAdminOrderDto(Order order);
    OrderDto entityToDto(Order order);
}
