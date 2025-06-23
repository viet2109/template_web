package com.example.be.controllers;

import com.example.be.dto.seller.SellerDashboardDto;
import com.example.be.dto.seller.SellerProfileDto;
import com.example.be.dto.seller.SellerRegisterDto;
import com.example.be.dto.seller.UpdateSellerProfileDto;
import com.example.be.services.SecurityService;
import com.example.be.services.facade.SellerFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sellers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
@Tag(
        name = "Người bán",
        description = "Các API quản lý hồ sơ và dashboard cho Seller"
)
@SecurityRequirement(name = "bearerAuth")
public class SellerController {

    private final SellerFacadeService sellerFacadeService;
    private final SecurityService securityService;

    @Operation(
            summary = "Tạo hồ sơ Seller",
            description = "Đăng ký thông tin bán hàng cho người dùng hiện tại"
    )
    @PostMapping
    public ResponseEntity<SellerProfileDto> createSellerProfile(
            @Valid @RequestBody SellerRegisterDto request) throws Exception {

        Long userId = securityService.getUserFromRequest().getId();
        SellerProfileDto profile = sellerFacadeService.createSellerProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Lấy hồ sơ Seller",
            description = "Trả về thông tin hồ sơ Seller theo ID"
    )
    @GetMapping("/{id}/profile")
    public ResponseEntity<SellerProfileDto> getSellerProfile(@PathVariable Long id) throws Exception {
        SellerProfileDto profile = sellerFacadeService.getSellerProfile(id);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Cập nhật hồ sơ Seller",
            description = "Chỉnh sửa thông tin hồ sơ Seller theo ID"
    )
    @PutMapping("/{id}/profile")
    public ResponseEntity<SellerProfileDto> updateSellerProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSellerProfileDto request) throws Exception {

        SellerProfileDto profile = sellerFacadeService.updateSellerProfile(id, request);
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "Lấy dashboard Seller",
            description = "Trả về số liệu tổng quan (doanh thu, đơn hàng, template) cho Seller theo ID"
    )
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<SellerDashboardDto> getDashboard(@PathVariable Long id) throws Exception {
        SellerDashboardDto dashboard = sellerFacadeService.getDashboard(id);
        return ResponseEntity.ok(dashboard);
    }
}
