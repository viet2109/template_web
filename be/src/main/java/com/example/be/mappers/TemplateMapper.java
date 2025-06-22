package com.example.be.mappers;

import com.example.be.dto.admin.AdminTemplateDto;
import com.example.be.dto.seller.CreateTemplateDto;
import com.example.be.dto.seller.SellerTemplateDto;
import com.example.be.dto.user.TemplateCardDto;
import com.example.be.dto.user.TemplateDetailDto;
import com.example.be.entities.Template;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TemplateMapper {
    Template dtoToEntity(CreateTemplateDto dto);

    TemplateDetailDto entityToDto(Template template);

    SellerTemplateDto entityToSellerTemplateDto(Template template);

    TemplateCardDto entityToCardDto(Template template);

    AdminTemplateDto entityToAdminDto(Template template);
}
