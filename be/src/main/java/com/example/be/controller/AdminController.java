package com.example.be.controller;

import com.example.be.dto.admin.AdminDashboardDto;
import com.example.be.services.facade.AdminFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(
        name = "Quản trị viên",
        description = "Các API dành cho vai trò ADMIN, chỉ cho phép truy cập khi đã đăng nhập với quyền ADMIN"
)
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminFacadeService adminFacadeService;

    @Operation(
            summary = "Lấy số liệu dashboard của Admin",
            description = "Trả về tổng quan thống kê cho trang quản trị viên (người dùng, đơn hàng, doanh thu, ...)"
    )
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        AdminDashboardDto dashboard = adminFacadeService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
