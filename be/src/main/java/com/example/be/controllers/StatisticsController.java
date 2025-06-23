package com.example.be.controllers;

import com.example.be.dto.user.SiteStatsDto;
import com.example.be.dto.user.TemplateCardDto;
import com.example.be.entities.User;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.PublicFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
@Tag(
        name = "Thống kê công khai",
        description = "Các API cung cấp số liệu và nội dung xu hướng cho trang public"
)
public class StatisticsController {

    private final PublicFacadeService publicFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Lấy số liệu tổng quan của trang",
            description = "Trả về các chỉ số như tổng số users, tổng đơn hàng, doanh thu,… hiển thị công khai"
    )
    @GetMapping("/public")
    public ResponseEntity<SiteStatsDto> getPublicStatistics() {
        SiteStatsDto statistics = publicFacadeService.getSiteStatistics();
        return ResponseEntity.ok(statistics);
    }

    @Operation(
            summary = "Lấy danh sách template xu hướng",
            description = "Trả về các template phổ biến, có thể truyền token để cá nhân hóa cho user đã đăng nhập"
    )
    @GetMapping("/trending")
    public ResponseEntity<List<TemplateCardDto>> getTrendingTemplates() {
        User user = securityService.getUserFromRequest();
        List<TemplateCardDto> trendingTemplates = publicFacadeService.getPopularTemplates(
                user != null ? user.getId() : null
        );
        return ResponseEntity.ok(trendingTemplates);
    }
}
